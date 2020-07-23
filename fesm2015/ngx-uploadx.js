import { __awaiter, __decorate } from 'tslib';
import { NgZone, defineInjectable, inject, Injectable, EventEmitter, ElementRef, Renderer2, Output, Input, HostListener, Directive, HostBinding, ContentChild, NgModule } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

/**
 * @internal
 */
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["Restart"] = 0] = "Restart";
    ErrorType[ErrorType["Auth"] = 1] = "Auth";
    ErrorType[ErrorType["Retryable"] = 2] = "Retryable";
    ErrorType[ErrorType["FatalError"] = 3] = "FatalError";
})(ErrorType || (ErrorType = {}));
class ErrorHandler {
    constructor() {
        this.min = 500;
        this.max = this.min * 120;
        this.factor = 2;
        this.attempts = 1;
        this.code = -1;
        this.delay = this.min;
    }
    kind(code) {
        if (code === this.code) {
            this.attempts++;
            if (this.attempts > ErrorHandler.maxAttempts) {
                return ErrorType.FatalError;
            }
        }
        else {
            this.reset();
        }
        this.code = code;
        if (ErrorHandler.authErrorCodes.includes(code)) {
            return ErrorType.Auth;
        }
        if (ErrorHandler.shouldRestartCodes.includes(code)) {
            return ErrorType.Restart;
        }
        if (code < 400 || code >= 500 || ErrorHandler.shouldRetryCodes.includes(code)) {
            return ErrorType.Retryable;
        }
        return ErrorType.FatalError;
    }
    wait() {
        return new Promise(resolve => {
            this.delay = Math.min(this.delay * this.factor, this.max);
            setTimeout(() => resolve(this.attempts), this.delay + Math.floor(Math.random() * this.min));
        });
    }
    reset() {
        this.delay = this.min;
        this.attempts = 1;
        this.code = -1;
    }
}
ErrorHandler.maxAttempts = 8;
ErrorHandler.shouldRestartCodes = [404, 410];
ErrorHandler.authErrorCodes = [401];
ErrorHandler.shouldRetryCodes = [423, 429];

class Store {
    constructor(prefix = 'UPLOADX-V3.0-') {
        this.prefix = prefix;
    }
    set(key, value) {
        localStorage.setItem(this.prefix + key, value);
    }
    get(key) {
        return localStorage.getItem(this.prefix + key);
    }
    delete(key) {
        localStorage.removeItem(this.prefix + key);
    }
}
const store = 'localStorage' in window ? new Store() : new Map();

// tslint:disable: no-bitwise
function safeMatch(base, re) {
    return (base.match(re) || [])[0] || '';
}
function resolveUrl(url, base) {
    if (url.indexOf('https://') * url.indexOf('http://') === 0) {
        return url;
    }
    if (url.indexOf('//') === 0) {
        return safeMatch(base, /^(https?:)/) + url;
    }
    if (url.indexOf('/') === 0) {
        return safeMatch(base, /^(?:https?:)?(?:\/\/)?([^\/\?]+)/) + url;
    }
    return safeMatch(base, /^(?:https?:)?(?:\/\/)?([^\/\?]+)?(.*\/)/) + url;
}
function unfunc(value, ref) {
    return value instanceof Function ? value(ref) : value;
}
const noop = () => { };
const pick = (obj, whitelist) => {
    const result = {};
    whitelist.forEach(key => (result[key] = obj[key]));
    return result;
};
function isNumber(x) {
    return x === Number(x);
}
function isString(x) {
    return typeof x === 'string';
}
/**
 * 32-bit FNV-1a hash function
 */
function createHash(str) {
    let hash = 2166136261;
    const len = str.length;
    for (let i = 0; i < len; i++) {
        hash ^= str.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return hash >>> 0;
}
const b64 = {
    encode: (str) => btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode(Number.parseInt(p1, 16)))),
    decode: (str) => decodeURIComponent(atob(str)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')),
    serialize: (obj) => {
        return Object.entries(obj)
            .map(([key, value]) => `${key} ${b64.encode(String(value))}`)
            .toString();
    },
    parse: (encoded) => {
        const kvPairs = encoded.split(',').map(kv => kv.split(' '));
        const decoded = Object.create(null);
        for (const [key, value] of kvPairs) {
            decoded[key] = b64.decode(value);
        }
        return decoded;
    }
};
/**
 * Adaptive chunk size
 */
class DynamicChunk {
    static scale(throughput) {
        const elapsedTime = DynamicChunk.size / throughput;
        if (elapsedTime < DynamicChunk.minChunkTime) {
            DynamicChunk.size = Math.min(DynamicChunk.maxSize, DynamicChunk.size * 2);
        }
        if (elapsedTime > DynamicChunk.maxChunkTime) {
            DynamicChunk.size = Math.max(DynamicChunk.minSize, DynamicChunk.size / 2);
        }
        return DynamicChunk.size;
    }
}
/** Maximum chunk size in bytes */
DynamicChunk.maxSize = Number.MAX_SAFE_INTEGER;
/** Minimum chunk size in bytes */
DynamicChunk.minSize = 1024 * 256;
/** Initial chunk size in bytes */
DynamicChunk.size = 4096 * 256;
DynamicChunk.minChunkTime = 2;
DynamicChunk.maxChunkTime = 8;

const actionToStatusMap = {
    pause: 'paused',
    upload: 'queue',
    cancel: 'cancelled',
    uploadAll: 'queue',
    pauseAll: 'paused',
    cancelAll: 'cancelled'
};
/**
 * Uploader Base Class
 */
class Uploader {
    constructor(file, options) {
        this.file = file;
        this.options = options;
        /** Custom headers */
        this.headers = {};
        /** Upload endpoint */
        this.endpoint = '/upload';
        /** Retries handler */
        this.errorHandler = new ErrorHandler();
        /** byte offset within the whole file */
        this.offset = 0;
        /** Set HttpRequest responseType */
        this.responseType = '';
        this._url = '';
        this.cleanup = () => store.delete(this.uploadId);
        this.name = file.name;
        this.size = file.size;
        this.metadata = {
            name: file.name,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
            lastModified: file.lastModified
        };
        const print = JSON.stringify(Object.assign({}, this.metadata, { type: this.constructor.name, endpoint: options.endpoint }));
        this.uploadId = createHash(print).toString(16);
        this.stateChange = options.stateChange || noop;
        this.chunkSize = options.chunkSize || this.size;
        this.configure(options);
    }
    set status(s) {
        if (this._status === 'cancelled' || (this._status === 'complete' && s !== 'cancelled')) {
            return;
        }
        if (s !== this._status) {
            s === 'paused' && this.abort();
            this._status = s;
            ['cancelled', 'complete', 'error'].includes(s) && this.cleanup();
            s === 'cancelled' ? this.onCancel() : this.stateChange(this);
        }
    }
    get status() {
        return this._status;
    }
    get url() {
        return this._url || store.get(this.uploadId) || '';
    }
    set url(value) {
        this._url !== value && store.set(this.uploadId, value);
        this._url = value;
    }
    /**
     * Configure uploader
     */
    configure({ metadata = {}, headers = {}, token, endpoint, action }) {
        this.endpoint = endpoint || this.endpoint;
        this.token = token || this.token;
        this.metadata = Object.assign({}, this.metadata, unfunc(metadata, this.file));
        this.headers = Object.assign({}, this.headers, unfunc(headers, this.file));
        action && (this.status = actionToStatusMap[action]);
    }
    /**
     * Starts uploading
     */
    upload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.status = 'uploading';
            try {
                yield this.getToken();
                this.offset = undefined;
                this.startTime = new Date().getTime();
                this.url = this.url || (yield this.getFileUrl());
                this.errorHandler.reset();
                this.start();
            }
            catch (_a) {
                if (this.errorHandler.kind(this.responseStatus) !== ErrorType.FatalError) {
                    this.status = 'retry';
                    yield this.errorHandler.wait();
                    this.status = 'queue';
                }
                else {
                    this.status = 'error';
                }
            }
        });
    }
    /**
     * Starts chunk upload
     */
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.status === 'uploading' || this.status === 'retry') {
                if (this.offset !== this.size) {
                    try {
                        const offset = isNumber(this.offset)
                            ? yield this.sendFileContent()
                            : yield this.getOffset();
                        if (offset === this.offset) {
                            throw new Error('Content upload failed');
                        }
                        this.errorHandler.reset();
                        this.offset = offset;
                    }
                    catch (_a) {
                        const errType = this.errorHandler.kind(this.responseStatus);
                        if (this.responseStatus === 413) {
                            DynamicChunk.maxSize = this.chunkSize /= 2;
                        }
                        else if (errType === ErrorType.FatalError) {
                            this.status = 'error';
                        }
                        else if (errType === ErrorType.Restart) {
                            this.url = '';
                            this.status = 'queue';
                        }
                        else if (errType === ErrorType.Auth) {
                            yield this.getToken();
                        }
                        else {
                            this.status = 'retry';
                            yield this.errorHandler.wait();
                            this.offset = this.responseStatus >= 400 ? undefined : this.offset;
                            this.status = 'uploading';
                        }
                    }
                }
                else {
                    this.progress = 100;
                    this.remaining = 0;
                    this.status = 'complete';
                }
            }
        });
    }
    /**
     * Performs http requests
     */
    request({ method = 'GET', body = null, url, headers = {}, progress }) {
        return new Promise((resolve, reject) => {
            const xhr = (this._xhr = new XMLHttpRequest());
            xhr.open(method, url || this.url, true);
            if (body instanceof Blob || (body && progress)) {
                xhr.upload.onprogress = this.onProgress();
            }
            this.responseStatus = 0;
            this.response = undefined;
            this.responseType && (xhr.responseType = this.responseType);
            this.options.withCredentials && (xhr.withCredentials = true);
            const _headers = Object.assign({}, this.headers, headers);
            Object.keys(_headers).forEach(key => xhr.setRequestHeader(key, _headers[key]));
            xhr.onload = (evt) => {
                this.responseStatus = xhr.status;
                this.response = this.responseStatus !== 204 ? this.getResponseBody(xhr) : '';
                this.responseStatus >= 400 ? reject(evt) : resolve(evt);
            };
            xhr.onerror = reject;
            xhr.send(body);
        });
    }
    setAuth(token) {
        this.headers.Authorization = `Bearer ${token}`;
    }
    abort() {
        this.offset = undefined;
        this._xhr && this._xhr.abort();
    }
    onCancel() {
        this.abort();
        const stateChange = () => this.stateChange(this);
        if (this.url) {
            this.request({ method: 'DELETE' }).then(stateChange, stateChange);
        }
        else {
            stateChange();
        }
    }
    /**
     * Gets the value from the response
     */
    getValueFromResponse(key) {
        return this._xhr.getResponseHeader(key);
    }
    /**
     * Set auth token
     */
    getToken() {
        return Promise.resolve(unfunc(this.token || '', this.responseStatus)).then(token => token && this.setAuth(token));
    }
    getChunk() {
        this.chunkSize = isNumber(this.options.chunkSize) ? this.chunkSize : DynamicChunk.size;
        const start = this.offset || 0;
        const end = Math.min(start + this.chunkSize, this.size);
        const body = this.file.slice(this.offset, end);
        return { start, end, body };
    }
    getResponseBody(xhr) {
        let body = 'response' in xhr ? xhr.response : xhr.responseText;
        if (body && this.responseType === 'json' && typeof body === 'string') {
            try {
                body = JSON.parse(body);
            }
            catch (_a) { }
        }
        return body;
    }
    onProgress() {
        let throttle = 0;
        return ({ loaded }) => {
            const now = new Date().getTime();
            const uploaded = this.offset + loaded;
            const elapsedTime = (now - this.startTime) / 1000;
            this.speed = Math.round(uploaded / elapsedTime);
            DynamicChunk.scale(this.speed);
            if (!throttle) {
                throttle = window.setTimeout(() => (throttle = 0), 500);
                this.progress = +((uploaded / this.size) * 100).toFixed(2);
                this.remaining = Math.ceil((this.size - uploaded) / this.speed);
                this.stateChange(this);
            }
        };
    }
}

/**
 * Implements tus resumable upload protocol
 * @see
 * https://github.com/tus/tus-resumable-upload-protocol/blob/master/protocol.md
 */
class Tus extends Uploader {
    constructor() {
        super(...arguments);
        this.headers = { 'Tus-Resumable': '1.0.0' };
    }
    getFileUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const encodedMetaData = b64.serialize(this.metadata);
            const headers = {
                'Upload-Length': `${this.size}`,
                'Upload-Metadata': `${encodedMetaData}`
            };
            yield this.request({ method: 'POST', url: this.endpoint, headers });
            const location = this.getValueFromResponse('location');
            if (!location) {
                throw new Error('Invalid or missing Location header');
            }
            this.offset = this.responseStatus === 201 ? 0 : undefined;
            return resolveUrl(location, this.endpoint);
        });
    }
    sendFileContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = this.getChunk();
            const headers = {
                'Content-Type': 'application/offset+octet-stream',
                'Upload-Offset': `${this.offset}`,
                'ngsw-bypass': 'true'
            };
            yield this.request({ method: 'PATCH', body, headers });
            return this.getOffsetFromResponse();
        });
    }
    getOffset() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.request({ method: 'HEAD' });
            return this.getOffsetFromResponse();
        });
    }
    getOffsetFromResponse() {
        const offsetStr = this.getValueFromResponse('Upload-Offset');
        return offsetStr ? parseInt(offsetStr, 10) : undefined;
    }
}

/**
 * Implements XHR/CORS Resumable Upload
 * @see
 * https://developers.google.com/drive/api/v3/manage-uploads#resumable
 */
class UploaderX extends Uploader {
    constructor() {
        super(...arguments);
        this.responseType = 'json';
    }
    getFileUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Upload-Content-Length': this.size.toString(),
                'X-Upload-Content-Type': this.file.type || 'application/octet-stream',
                'ngsw-bypass': 'true'
            };
            yield this.request({
                method: 'POST',
                body: JSON.stringify(this.metadata),
                url: this.endpoint,
                headers
            });
            const location = this.getValueFromResponse('location');
            if (!location) {
                throw new Error('Invalid or missing Location header');
            }
            this.offset = this.responseStatus === 201 ? 0 : undefined;
            return resolveUrl(location, this.endpoint);
        });
    }
    sendFileContent() {
        return __awaiter(this, void 0, void 0, function* () {
            const { end, body } = this.getChunk();
            const headers = {
                'Content-Type': 'application/octet-stream',
                'Content-Range': `bytes ${this.offset}-${end - 1}/${this.size}`,
                'ngsw-bypass': 'true',
                'ngsw-bypass': 'true'
            };
            yield this.request({ method: 'PUT', body, headers });
            return this.getOffsetFromResponse();
        });
    }
    getOffset() {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Content-Type': 'application/octet-stream',
                'Content-Range': `bytes */${this.size}`,
                'ngsw-bypass': 'true'
            };
            yield this.request({ method: 'PUT', headers });
            return this.getOffsetFromResponse();
        });
    }
    getOffsetFromResponse() {
        if (this.responseStatus > 201) {
            const range = this.getValueFromResponse('Range');
            return range ? getRangeEnd(range) + 1 : undefined;
        }
        if (this.responseStatus <= 201) {
            return this.size;
        }
    }
}
function getRangeEnd(range = '') {
    const end = +range.split(/0-/)[1];
    return end >= 0 ? end : -1;
}

var UploadxService_1;
let UploadxService = UploadxService_1 = class UploadxService {
    constructor(ngZone) {
        this.ngZone = ngZone;
        /** Upload Queue */
        this.queue = [];
        this.options = {
            endpoint: '/upload',
            autoUpload: true,
            concurrency: 2,
            stateChange: (evt) => {
                setTimeout(() => this.ngZone.run(() => this.eventsStream.next(pick(evt, UploadxService_1.stateKeys))));
            }
        };
        this.eventsStream = new Subject();
        this.subs = [];
        this.subs.push(fromEvent(window, 'online').subscribe(() => this.control({ action: 'upload' })), fromEvent(window, 'offline').subscribe(() => this.control({ action: 'pause' })), this.events.subscribe(({ status }) => {
            if (status !== 'uploading' && status !== 'added') {
                this.ngZone.runOutsideAngular(() => this.processQueue());
            }
        }));
    }
    /** Upload status events */
    get events() {
        return this.eventsStream.asObservable();
    }
    /**
     * Initializes service
     * @param options global module options
     * @returns Observable that emits a new value on progress or status changes
     */
    init(options = {}) {
        Object.assign(this.options, options);
        return this.events;
    }
    /**
     * Initializes service
     * @param options global module options
     * @returns Observable that emits the current array of uploaders
     */
    connect(options) {
        return this.init(options).pipe(startWith(0), map(() => this.queue));
    }
    /**
     * Terminates all uploads and clears the queue
     */
    disconnect() {
        this.queue.forEach(uploader => (uploader.status = 'paused'));
        this.queue = [];
    }
    ngOnDestroy() {
        this.disconnect();
        this.subs.forEach(sub => sub.unsubscribe());
    }
    /**
     * Create Uploader and add to the queue
     */
    handleFileList(fileList, options = {}) {
        const instanceOptions = Object.assign({}, this.options, options);
        this.options.concurrency = instanceOptions.concurrency;
        Array.from(fileList).forEach(file => this.addUploaderInstance(file, instanceOptions));
        this.autoUploadFiles();
    }
    /**
     * Create Uploader for the file and add to the queue
     */
    handleFile(file, options = {}) {
        const instanceOptions = Object.assign({}, this.options, options);
        this.addUploaderInstance(file, instanceOptions);
        this.autoUploadFiles();
    }
    /**
     * Upload control
     * @example
     * // pause all
     * this.uploadService.control({ action: 'pause' });
     * // pause upload with uploadId
     * this.uploadService.control({ action: 'pause', uploadId});
     * // set token
     * this.uploadService.control({ token: `TOKEN` });
     */
    control(evt) {
        const target = evt.uploadId
            ? this.queue.filter(({ uploadId }) => uploadId === evt.uploadId)
            : this.queue;
        target.forEach(uploader => uploader.configure(evt));
    }
    /**
     * Returns number of active uploads
     */
    runningProcess() {
        return this.queue.filter(({ status }) => status === 'uploading' || status === 'retry').length;
    }
    addUploaderInstance(file, options) {
        const uploader = new (options.uploaderClass || UploaderX)(file, options);
        this.queue.push(uploader);
        uploader.status = 'added';
    }
    autoUploadFiles() {
        if (this.options.autoUpload && window.navigator.onLine) {
            this.queue
                .filter(({ status }) => status === 'added')
                .forEach(uploader => (uploader.status = 'queue'));
        }
    }
    processQueue() {
        this.queue = this.queue.filter(({ status }) => status !== 'cancelled');
        this.queue
            .filter(({ status }) => status === 'queue')
            .slice(0, Math.max(this.options.concurrency - this.runningProcess(), 0))
            .forEach(uploader => uploader.upload());
    }
};
UploadxService.stateKeys = [
    'file',
    'name',
    'progress',
    'remaining',
    'response',
    'responseStatus',
    'size',
    'speed',
    'status',
    'uploadId',
    'url'
];
UploadxService.ctorParameters = () => [
    { type: NgZone }
];
UploadxService.ngInjectableDef = defineInjectable({ factory: function UploadxService_Factory() { return new UploadxService(inject(NgZone)); }, token: UploadxService, providedIn: "root" });
UploadxService = UploadxService_1 = __decorate([
    Injectable({ providedIn: 'root' })
], UploadxService);

let UploadxDirective = class UploadxDirective {
    constructor(elementRef, renderer, uploadService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.uploadService = uploadService;
        this.uploadxState = new EventEmitter();
    }
    set uploadxAction(ctrlEvent) {
        if (ctrlEvent && this.uploadService) {
            this.uploadService.control(ctrlEvent);
        }
    }
    ngOnInit() {
        const { multiple, allowedTypes } = this.uploadx;
        multiple !== false && this.renderer.setAttribute(this.elementRef.nativeElement, 'multiple', '');
        allowedTypes &&
            this.renderer.setAttribute(this.elementRef.nativeElement, 'accept', allowedTypes);
        this.uploadxState.emit(this.uploadService.events);
    }
    fileListener(files) {
        if (files && files.item(0)) {
            this.uploadService.handleFileList(files, this.uploadx);
        }
    }
};
UploadxDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: UploadxService }
];
__decorate([
    Output()
], UploadxDirective.prototype, "uploadxState", void 0);
__decorate([
    Input()
], UploadxDirective.prototype, "uploadx", void 0);
__decorate([
    Input()
], UploadxDirective.prototype, "uploadxAction", null);
__decorate([
    HostListener('change', ['$event.target.files'])
], UploadxDirective.prototype, "fileListener", null);
UploadxDirective = __decorate([
    Directive({ selector: '[uploadx]' })
], UploadxDirective);

let UploadxDropDirective = class UploadxDropDirective {
    constructor(uploadService) {
        this.uploadService = uploadService;
        this.active = false;
    }
    dropHandler(event) {
        if (event.dataTransfer && event.dataTransfer.files) {
            event.stopPropagation();
            event.preventDefault();
            this.active = false;
            if (event.dataTransfer.files.item(0)) {
                this.uploadService.handleFileList(event.dataTransfer.files, this.fileInput.uploadx);
            }
        }
    }
    onDragOver(event) {
        if (event.dataTransfer && event.dataTransfer.files) {
            event.dataTransfer.dropEffect = 'copy';
            event.stopPropagation();
            event.preventDefault();
            this.active = true;
        }
    }
    onDragLeave(event) {
        this.active = false;
    }
};
UploadxDropDirective.ctorParameters = () => [
    { type: UploadxService }
];
__decorate([
    HostBinding('class.uploadx-drop-active')
], UploadxDropDirective.prototype, "active", void 0);
__decorate([
    ContentChild(UploadxDirective)
], UploadxDropDirective.prototype, "fileInput", void 0);
__decorate([
    HostListener('drop', ['$event'])
], UploadxDropDirective.prototype, "dropHandler", null);
__decorate([
    HostListener('dragover', ['$event'])
], UploadxDropDirective.prototype, "onDragOver", null);
__decorate([
    HostListener('dragleave', ['$event'])
], UploadxDropDirective.prototype, "onDragLeave", null);
UploadxDropDirective = __decorate([
    Directive({ selector: '[uploadxDrop]' })
], UploadxDropDirective);

let UploadxModule = class UploadxModule {
};
UploadxModule = __decorate([
    NgModule({
        declarations: [UploadxDirective, UploadxDropDirective],
        exports: [UploadxDirective, UploadxDropDirective]
    })
], UploadxModule);

/**
 * Generated bundle index. Do not edit.
 */

export { DynamicChunk, ErrorHandler, ErrorType, Tus, Uploader, UploaderX, UploadxDirective, UploadxDropDirective, UploadxModule, UploadxService, b64, createHash, getRangeEnd, isNumber, isString, noop, pick, resolveUrl, unfunc };
//# sourceMappingURL=ngx-uploadx.js.map
