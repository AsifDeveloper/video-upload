import * as tslib_1 from "tslib";
import { ErrorHandler, ErrorType } from './error-handler';
import { store } from './store';
import { createHash, DynamicChunk, isNumber, noop, unfunc } from './utils';
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
export class Uploader {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdXBsb2FkeC8iLCJzb3VyY2VzIjpbImxpYi91cGxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQVExRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRTNFLE1BQU0saUJBQWlCLEdBQTBDO0lBQy9ELEtBQUssRUFBRSxRQUFRO0lBQ2YsTUFBTSxFQUFFLE9BQU87SUFDZixNQUFNLEVBQUUsV0FBVztJQUNuQixTQUFTLEVBQUUsT0FBTztJQUNsQixRQUFRLEVBQUUsUUFBUTtJQUNsQixTQUFTLEVBQUUsV0FBVztDQUN2QixDQUFDO0FBU0Y7O0dBRUc7QUFDSCxNQUFNLE9BQWdCLFFBQVE7SUFxRDVCLFlBQXFCLElBQVUsRUFBVyxPQUF3QjtRQUE3QyxTQUFJLEdBQUosSUFBSSxDQUFNO1FBQVcsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUF2QmxFLHFCQUFxQjtRQUNyQixZQUFPLEdBQXdCLEVBQUUsQ0FBQztRQUdsQyxzQkFBc0I7UUFDdEIsYUFBUSxHQUFHLFNBQVMsQ0FBQztRQUtyQixzQkFBc0I7UUFDWixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFHNUMsd0NBQXdDO1FBQzlCLFdBQU0sR0FBSSxDQUFDLENBQUM7UUFDdEIsbUNBQW1DO1FBQ3pCLGlCQUFZLEdBQStCLEVBQUUsQ0FBQztRQUNoRCxTQUFJLEdBQUcsRUFBRSxDQUFDO1FBNkxWLFlBQU8sR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQXZMbEQsSUFBSSxDQUFDLElBQUks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QyxDQUFDO1lBQy9CLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2IsUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3hELElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hCO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXJyb3JIYW5kbGVyLCBFcnJvclR5cGUgfSBmcm9tICcuL2Vycm9yLWhhbmRsZXInO1xuaW1wb3J0IHtcbiAgVXBsb2FkQWN0aW9uLFxuICBVcGxvYWRlck9wdGlvbnMsXG4gIFVwbG9hZFN0YXRlLFxuICBVcGxvYWRTdGF0dXMsXG4gIFVwbG9hZHhDb250cm9sRXZlbnRcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZSc7XG5pbXBvcnQgeyBjcmVhdGVIYXNoLCBEeW5hbWljQ2h1bmssIGlzTnVtYmVyLCBub29wLCB1bmZ1bmMgfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgYWN0aW9uVG9TdGF0dXNNYXA6IHsgW0sgaW4gVXBsb2FkQWN0aW9uXTogVXBsb2FkU3RhdHVzIH0gPSB7XG4gIHBhdXNlOiAncGF1c2VkJyxcbiAgdXBsb2FkOiAncXVldWUnLFxuICBjYW5jZWw6ICdjYW5jZWxsZWQnLFxuICB1cGxvYWRBbGw6ICdxdWV1ZScsXG4gIHBhdXNlQWxsOiAncGF1c2VkJyxcbiAgY2FuY2VsQWxsOiAnY2FuY2VsbGVkJ1xufTtcbmludGVyZmFjZSBSZXF1ZXN0UGFyYW1zIHtcbiAgbWV0aG9kOiAnR0VUJyB8ICdQT1NUJyB8ICdQVVQnIHwgJ0RFTEVURScgfCAnUEFUQ0gnIHwgJ0hFQUQnIHwgJ09QVElPTlMnO1xuICBib2R5PzogQm9keUluaXQgfCBudWxsO1xuICB1cmw/OiBzdHJpbmc7XG4gIGhlYWRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBwcm9ncmVzcz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogVXBsb2FkZXIgQmFzZSBDbGFzc1xuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVXBsb2FkZXIgaW1wbGVtZW50cyBVcGxvYWRTdGF0ZSB7XG4gIHNldCBzdGF0dXMoczogVXBsb2FkU3RhdHVzKSB7XG4gICAgaWYgKHRoaXMuX3N0YXR1cyA9PT0gJ2NhbmNlbGxlZCcgfHwgKHRoaXMuX3N0YXR1cyA9PT0gJ2NvbXBsZXRlJyAmJiBzICE9PSAnY2FuY2VsbGVkJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHMgIT09IHRoaXMuX3N0YXR1cykge1xuICAgICAgcyA9PT0gJ3BhdXNlZCcgJiYgdGhpcy5hYm9ydCgpO1xuICAgICAgdGhpcy5fc3RhdHVzID0gcztcbiAgICAgIFsnY2FuY2VsbGVkJywgJ2NvbXBsZXRlJywgJ2Vycm9yJ10uaW5jbHVkZXMocykgJiYgdGhpcy5jbGVhbnVwKCk7XG4gICAgICBzID09PSAnY2FuY2VsbGVkJyA/IHRoaXMub25DYW5jZWwoKSA6IHRoaXMuc3RhdGVDaGFuZ2UodGhpcyk7XG4gICAgfVxuICB9XG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cztcbiAgfVxuICBnZXQgdXJsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3VybCB8fCBzdG9yZS5nZXQodGhpcy51cGxvYWRJZCkgfHwgJyc7XG4gIH1cbiAgc2V0IHVybCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXJsICE9PSB2YWx1ZSAmJiBzdG9yZS5zZXQodGhpcy51cGxvYWRJZCwgdmFsdWUpO1xuICAgIHRoaXMuX3VybCA9IHZhbHVlO1xuICB9XG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgc2l6ZTogbnVtYmVyO1xuICByZWFkb25seSB1cGxvYWRJZDogc3RyaW5nO1xuICByZXNwb25zZTogYW55O1xuICByZXNwb25zZVN0YXR1czogbnVtYmVyO1xuICBwcm9ncmVzczogbnVtYmVyO1xuICByZW1haW5pbmc6IG51bWJlcjtcbiAgc3BlZWQ6IG51bWJlcjtcbiAgLyoqIEN1c3RvbSBoZWFkZXJzICovXG4gIGhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgLyoqIE1ldGFkYXRhIE9iamVjdCAqL1xuICBtZXRhZGF0YTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgLyoqIFVwbG9hZCBlbmRwb2ludCAqL1xuICBlbmRwb2ludCA9ICcvdXBsb2FkJztcbiAgLyoqIENodW5rIHNpemUgaW4gYnl0ZXMgKi9cbiAgY2h1bmtTaXplOiBudW1iZXI7XG4gIC8qKiBBdXRoIHRva2VuL3Rva2VuR2V0dGVyICovXG4gIHRva2VuOiBVcGxvYWR4Q29udHJvbEV2ZW50Wyd0b2tlbiddO1xuICAvKiogUmV0cmllcyBoYW5kbGVyICovXG4gIHByb3RlY3RlZCBlcnJvckhhbmRsZXIgPSBuZXcgRXJyb3JIYW5kbGVyKCk7XG4gIC8qKiBBY3RpdmUgSHR0cFJlcXVlc3QgKi9cbiAgcHJvdGVjdGVkIF94aHI6IFhNTEh0dHBSZXF1ZXN0O1xuICAvKiogYnl0ZSBvZmZzZXQgd2l0aGluIHRoZSB3aG9sZSBmaWxlICovXG4gIHByb3RlY3RlZCBvZmZzZXQ/ID0gMDtcbiAgLyoqIFNldCBIdHRwUmVxdWVzdCByZXNwb25zZVR5cGUgKi9cbiAgcHJvdGVjdGVkIHJlc3BvbnNlVHlwZTogWE1MSHR0cFJlcXVlc3RSZXNwb25zZVR5cGUgPSAnJztcbiAgcHJpdmF0ZSBfdXJsID0gJyc7XG4gIHByaXZhdGUgX3N0YXR1czogVXBsb2FkU3RhdHVzO1xuICBwcml2YXRlIHN0YXJ0VGltZTogbnVtYmVyO1xuICBwcml2YXRlIHN0YXRlQ2hhbmdlOiAoZXZ0OiBVcGxvYWRTdGF0ZSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihyZWFkb25seSBmaWxlOiBGaWxlLCByZWFkb25seSBvcHRpb25zOiBVcGxvYWRlck9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBmaWxlLm5hbWU7XG4gICAgdGhpcy5zaXplID0gZmlsZS5zaXplO1xuICAgIHRoaXMubWV0YWRhdGEgPSB7XG4gICAgICBuYW1lOiBmaWxlLm5hbWUsXG4gICAgICBtaW1lVHlwZTogZmlsZS50eXBlIHx8ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICAgICAgc2l6ZTogZmlsZS5zaXplLFxuICAgICAgbGFzdE1vZGlmaWVkOiBmaWxlLmxhc3RNb2RpZmllZFxuICAgIH07XG4gICAgY29uc3QgcHJpbnQgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAuLi50aGlzLm1ldGFkYXRhLFxuICAgICAgdHlwZTogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgZW5kcG9pbnQ6IG9wdGlvbnMuZW5kcG9pbnRcbiAgICB9KTtcbiAgICB0aGlzLnVwbG9hZElkID0gY3JlYXRlSGFzaChwcmludCkudG9TdHJpbmcoMTYpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2UgPSBvcHRpb25zLnN0YXRlQ2hhbmdlIHx8IG5vb3A7XG4gICAgdGhpcy5jaHVua1NpemUgPSBvcHRpb25zLmNodW5rU2l6ZSB8fCB0aGlzLnNpemU7XG4gICAgdGhpcy5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHVwbG9hZGVyXG4gICAqL1xuICBjb25maWd1cmUoeyBtZXRhZGF0YSA9IHt9LCBoZWFkZXJzID0ge30sIHRva2VuLCBlbmRwb2ludCwgYWN0aW9uIH06IFVwbG9hZHhDb250cm9sRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQgfHwgdGhpcy5lbmRwb2ludDtcbiAgICB0aGlzLnRva2VuID0gdG9rZW4gfHwgdGhpcy50b2tlbjtcbiAgICB0aGlzLm1ldGFkYXRhID0geyAuLi50aGlzLm1ldGFkYXRhLCAuLi51bmZ1bmMobWV0YWRhdGEsIHRoaXMuZmlsZSkgfTtcbiAgICB0aGlzLmhlYWRlcnMgPSB7IC4uLnRoaXMuaGVhZGVycywgLi4udW5mdW5jKGhlYWRlcnMsIHRoaXMuZmlsZSkgfTtcbiAgICBhY3Rpb24gJiYgKHRoaXMuc3RhdHVzID0gYWN0aW9uVG9TdGF0dXNNYXBbYWN0aW9uXSk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHVwbG9hZGluZ1xuICAgKi9cbiAgYXN5bmMgdXBsb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuc3RhdHVzID0gJ3VwbG9hZGluZyc7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZ2V0VG9rZW4oKTtcbiAgICAgIHRoaXMub2Zmc2V0ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHRoaXMudXJsID0gdGhpcy51cmwgfHwgKGF3YWl0IHRoaXMuZ2V0RmlsZVVybCgpKTtcbiAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLnJlc2V0KCk7XG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBpZiAodGhpcy5lcnJvckhhbmRsZXIua2luZCh0aGlzLnJlc3BvbnNlU3RhdHVzKSAhPT0gRXJyb3JUeXBlLkZhdGFsRXJyb3IpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAncmV0cnknO1xuICAgICAgICBhd2FpdCB0aGlzLmVycm9ySGFuZGxlci53YWl0KCk7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ3F1ZXVlJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ2Vycm9yJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIGNodW5rIHVwbG9hZFxuICAgKi9cbiAgYXN5bmMgc3RhcnQoKSB7XG4gICAgd2hpbGUgKHRoaXMuc3RhdHVzID09PSAndXBsb2FkaW5nJyB8fCB0aGlzLnN0YXR1cyA9PT0gJ3JldHJ5Jykge1xuICAgICAgaWYgKHRoaXMub2Zmc2V0ICE9PSB0aGlzLnNpemUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBvZmZzZXQgPSBpc051bWJlcih0aGlzLm9mZnNldClcbiAgICAgICAgICAgID8gYXdhaXQgdGhpcy5zZW5kRmlsZUNvbnRlbnQoKVxuICAgICAgICAgICAgOiBhd2FpdCB0aGlzLmdldE9mZnNldCgpO1xuICAgICAgICAgIGlmIChvZmZzZXQgPT09IHRoaXMub2Zmc2V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnRlbnQgdXBsb2FkIGZhaWxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlci5yZXNldCgpO1xuICAgICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICBjb25zdCBlcnJUeXBlID0gdGhpcy5lcnJvckhhbmRsZXIua2luZCh0aGlzLnJlc3BvbnNlU3RhdHVzKTtcbiAgICAgICAgICBpZiAodGhpcy5yZXNwb25zZVN0YXR1cyA9PT0gNDEzKSB7XG4gICAgICAgICAgICBEeW5hbWljQ2h1bmsubWF4U2l6ZSA9IHRoaXMuY2h1bmtTaXplIC89IDI7XG4gICAgICAgICAgfSBlbHNlIGlmIChlcnJUeXBlID09PSBFcnJvclR5cGUuRmF0YWxFcnJvcikge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnZXJyb3InO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXJyVHlwZSA9PT0gRXJyb3JUeXBlLlJlc3RhcnQpIHtcbiAgICAgICAgICAgIHRoaXMudXJsID0gJyc7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdxdWV1ZSc7XG4gICAgICAgICAgfSBlbHNlIGlmIChlcnJUeXBlID09PSBFcnJvclR5cGUuQXV0aCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5nZXRUb2tlbigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdyZXRyeSc7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmVycm9ySGFuZGxlci53YWl0KCk7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IHRoaXMucmVzcG9uc2VTdGF0dXMgPj0gNDAwID8gdW5kZWZpbmVkIDogdGhpcy5vZmZzZXQ7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICd1cGxvYWRpbmcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgdGhpcy5yZW1haW5pbmcgPSAwO1xuICAgICAgICB0aGlzLnN0YXR1cyA9ICdjb21wbGV0ZSc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGh0dHAgcmVxdWVzdHNcbiAgICovXG4gIHJlcXVlc3Qoe1xuICAgIG1ldGhvZCA9ICdHRVQnLFxuICAgIGJvZHkgPSBudWxsLFxuICAgIHVybCxcbiAgICBoZWFkZXJzID0ge30sXG4gICAgcHJvZ3Jlc3NcbiAgfTogUmVxdWVzdFBhcmFtcyk6IFByb21pc2U8UHJvZ3Jlc3NFdmVudD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB4aHIgPSAodGhpcy5feGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCkpO1xuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwgfHwgdGhpcy51cmwsIHRydWUpO1xuICAgICAgaWYgKGJvZHkgaW5zdGFuY2VvZiBCbG9iIHx8IChib2R5ICYmIHByb2dyZXNzKSkge1xuICAgICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSB0aGlzLm9uUHJvZ3Jlc3MoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVzcG9uc2VTdGF0dXMgPSAwO1xuICAgICAgdGhpcy5yZXNwb25zZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMucmVzcG9uc2VUeXBlICYmICh4aHIucmVzcG9uc2VUeXBlID0gdGhpcy5yZXNwb25zZVR5cGUpO1xuICAgICAgdGhpcy5vcHRpb25zLndpdGhDcmVkZW50aWFscyAmJiAoeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWUpO1xuICAgICAgY29uc3QgX2hlYWRlcnMgPSB7IC4uLnRoaXMuaGVhZGVycywgLi4uaGVhZGVycyB9O1xuICAgICAgT2JqZWN0LmtleXMoX2hlYWRlcnMpLmZvckVhY2goa2V5ID0+IHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgX2hlYWRlcnNba2V5XSkpO1xuICAgICAgeGhyLm9ubG9hZCA9IChldnQ6IFByb2dyZXNzRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5yZXNwb25zZVN0YXR1cyA9IHhoci5zdGF0dXM7XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSB0aGlzLnJlc3BvbnNlU3RhdHVzICE9PSAyMDQgPyB0aGlzLmdldFJlc3BvbnNlQm9keSh4aHIpIDogJyc7XG4gICAgICAgIHRoaXMucmVzcG9uc2VTdGF0dXMgPj0gNDAwID8gcmVqZWN0KGV2dCkgOiByZXNvbHZlKGV2dCk7XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSByZWplY3Q7XG4gICAgICB4aHIuc2VuZChib2R5KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZmlsZSBVUklcbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRGaWxlVXJsKCk6IFByb21pc2U8c3RyaW5nPjtcblxuICAvKipcbiAgICogU2VuZCBmaWxlIGNvbnRlbnQgYW5kIHJldHVybiBhbiBvZmZzZXQgZm9yIHRoZSBuZXh0IHJlcXVlc3RcbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBzZW5kRmlsZUNvbnRlbnQoKTogUHJvbWlzZTxudW1iZXIgfCB1bmRlZmluZWQ+O1xuXG4gIC8qKlxuICAgKiBHZXQgYW4gb2Zmc2V0IGZvciB0aGUgbmV4dCByZXF1ZXN0XG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0T2Zmc2V0KCk6IFByb21pc2U8bnVtYmVyIHwgdW5kZWZpbmVkPjtcblxuICBwcm90ZWN0ZWQgc2V0QXV0aCh0b2tlbjogc3RyaW5nKSB7XG4gICAgdGhpcy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgfVxuXG4gIHByb3RlY3RlZCBhYm9ydCgpOiB2b2lkIHtcbiAgICB0aGlzLm9mZnNldCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl94aHIgJiYgdGhpcy5feGhyLmFib3J0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25DYW5jZWwoKTogdm9pZCB7XG4gICAgdGhpcy5hYm9ydCgpO1xuICAgIGNvbnN0IHN0YXRlQ2hhbmdlID0gKCkgPT4gdGhpcy5zdGF0ZUNoYW5nZSh0aGlzKTtcbiAgICBpZiAodGhpcy51cmwpIHtcbiAgICAgIHRoaXMucmVxdWVzdCh7IG1ldGhvZDogJ0RFTEVURScgfSkudGhlbihzdGF0ZUNoYW5nZSwgc3RhdGVDaGFuZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZUNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB2YWx1ZSBmcm9tIHRoZSByZXNwb25zZVxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFZhbHVlRnJvbVJlc3BvbnNlKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3hoci5nZXRSZXNwb25zZUhlYWRlcihrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhdXRoIHRva2VuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VG9rZW4oKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVuZnVuYyh0aGlzLnRva2VuIHx8ICcnLCB0aGlzLnJlc3BvbnNlU3RhdHVzKSkudGhlbihcbiAgICAgIHRva2VuID0+IHRva2VuICYmIHRoaXMuc2V0QXV0aCh0b2tlbilcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldENodW5rKCkge1xuICAgIHRoaXMuY2h1bmtTaXplID0gaXNOdW1iZXIodGhpcy5vcHRpb25zLmNodW5rU2l6ZSkgPyB0aGlzLmNodW5rU2l6ZSA6IER5bmFtaWNDaHVuay5zaXplO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5vZmZzZXQgfHwgMDtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHRoaXMuY2h1bmtTaXplLCB0aGlzLnNpemUpO1xuICAgIGNvbnN0IGJvZHkgPSB0aGlzLmZpbGUuc2xpY2UodGhpcy5vZmZzZXQsIGVuZCk7XG4gICAgcmV0dXJuIHsgc3RhcnQsIGVuZCwgYm9keSB9O1xuICB9XG4gIHByaXZhdGUgY2xlYW51cCA9ICgpID0+IHN0b3JlLmRlbGV0ZSh0aGlzLnVwbG9hZElkKTtcblxuICBwcml2YXRlIGdldFJlc3BvbnNlQm9keSh4aHI6IFhNTEh0dHBSZXF1ZXN0KTogYW55IHtcbiAgICBsZXQgYm9keSA9ICdyZXNwb25zZScgaW4gKHhociBhcyBhbnkpID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dDtcbiAgICBpZiAoYm9keSAmJiB0aGlzLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nICYmIHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfVxuICAgIHJldHVybiBib2R5O1xuICB9XG5cbiAgcHJpdmF0ZSBvblByb2dyZXNzKCk6IChldnQ6IFByb2dyZXNzRXZlbnQpID0+IHZvaWQge1xuICAgIGxldCB0aHJvdHRsZSA9IDA7XG4gICAgcmV0dXJuICh7IGxvYWRlZCB9OiBQcm9ncmVzc0V2ZW50KSA9PiB7XG4gICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIGNvbnN0IHVwbG9hZGVkID0gKHRoaXMub2Zmc2V0IGFzIG51bWJlcikgKyBsb2FkZWQ7XG4gICAgICBjb25zdCBlbGFwc2VkVGltZSA9IChub3cgLSB0aGlzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgdGhpcy5zcGVlZCA9IE1hdGgucm91bmQodXBsb2FkZWQgLyBlbGFwc2VkVGltZSk7XG4gICAgICBEeW5hbWljQ2h1bmsuc2NhbGUodGhpcy5zcGVlZCk7XG4gICAgICBpZiAoIXRocm90dGxlKSB7XG4gICAgICAgIHRocm90dGxlID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gKHRocm90dGxlID0gMCksIDUwMCk7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3MgPSArKCh1cGxvYWRlZCAvIHRoaXMuc2l6ZSkgKiAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIHRoaXMucmVtYWluaW5nID0gTWF0aC5jZWlsKCh0aGlzLnNpemUgLSB1cGxvYWRlZCkgLyB0aGlzLnNwZWVkKTtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iXX0=