import * as tslib_1 from "tslib";
import { ErrorHandler, ErrorType } from './error-handler';
import { store } from './store';
import { createHash, DynamicChunk, isNumber, noop, unfunc } from './utils';
var actionToStatusMap = {
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
var Uploader = /** @class */ (function () {
    function Uploader(file, options) {
        var _this = this;
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
        this.cleanup = function () { return store.delete(_this.uploadId); };
        this.name = file.name;
        this.size = file.size;
        this.metadata = {
            name: file.name,
            mimeType: file.type || 'application/octet-stream',
            size: file.size,
            lastModified: file.lastModified
        };
        var print = JSON.stringify(tslib_1.__assign({}, this.metadata, { type: this.constructor.name, endpoint: options.endpoint }));
        this.uploadId = createHash(print).toString(16);
        this.stateChange = options.stateChange || noop;
        this.chunkSize = options.chunkSize || this.size;
        this.configure(options);
    }
    Object.defineProperty(Uploader.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (s) {
            if (this._status === 'cancelled' || (this._status === 'complete' && s !== 'cancelled')) {
                return;
            }
            if (s !== this._status) {
                s === 'paused' && this.abort();
                this._status = s;
                ['cancelled', 'complete', 'error'].includes(s) && this.cleanup();
                s === 'cancelled' ? this.onCancel() : this.stateChange(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Uploader.prototype, "url", {
        get: function () {
            return this._url || store.get(this.uploadId) || '';
        },
        set: function (value) {
            this._url !== value && store.set(this.uploadId, value);
            this._url = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Configure uploader
     */
    Uploader.prototype.configure = function (_a) {
        var _b = _a.metadata, metadata = _b === void 0 ? {} : _b, _c = _a.headers, headers = _c === void 0 ? {} : _c, token = _a.token, endpoint = _a.endpoint, action = _a.action;
        this.endpoint = endpoint || this.endpoint;
        this.token = token || this.token;
        this.metadata = tslib_1.__assign({}, this.metadata, unfunc(metadata, this.file));
        this.headers = tslib_1.__assign({}, this.headers, unfunc(headers, this.file));
        action && (this.status = actionToStatusMap[action]);
    };
    /**
     * Starts uploading
     */
    Uploader.prototype.upload = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.status = 'uploading';
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 5, , 9]);
                        return [4 /*yield*/, this.getToken()];
                    case 2:
                        _d.sent();
                        this.offset = undefined;
                        this.startTime = new Date().getTime();
                        _a = this;
                        _b = this.url;
                        if (_b) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getFileUrl()];
                    case 3:
                        _b = (_d.sent());
                        _d.label = 4;
                    case 4:
                        _a.url = _b;
                        this.errorHandler.reset();
                        this.start();
                        return [3 /*break*/, 9];
                    case 5:
                        _c = _d.sent();
                        if (!(this.errorHandler.kind(this.responseStatus) !== ErrorType.FatalError)) return [3 /*break*/, 7];
                        this.status = 'retry';
                        return [4 /*yield*/, this.errorHandler.wait()];
                    case 6:
                        _d.sent();
                        this.status = 'queue';
                        return [3 /*break*/, 8];
                    case 7:
                        this.status = 'error';
                        _d.label = 8;
                    case 8: return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Starts chunk upload
     */
    Uploader.prototype.start = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var offset, _a, _b, errType;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this.status === 'uploading' || this.status === 'retry')) return [3 /*break*/, 17];
                        if (!(this.offset !== this.size)) return [3 /*break*/, 15];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 6, , 14]);
                        if (!isNumber(this.offset)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.sendFileContent()];
                    case 2:
                        _a = _c.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.getOffset()];
                    case 4:
                        _a = _c.sent();
                        _c.label = 5;
                    case 5:
                        offset = _a;
                        if (offset === this.offset) {
                            throw new Error('Content upload failed');
                        }
                        this.errorHandler.reset();
                        this.offset = offset;
                        return [3 /*break*/, 14];
                    case 6:
                        _b = _c.sent();
                        errType = this.errorHandler.kind(this.responseStatus);
                        if (!(this.responseStatus === 413)) return [3 /*break*/, 7];
                        DynamicChunk.maxSize = this.chunkSize /= 2;
                        return [3 /*break*/, 13];
                    case 7:
                        if (!(errType === ErrorType.FatalError)) return [3 /*break*/, 8];
                        this.status = 'error';
                        return [3 /*break*/, 13];
                    case 8:
                        if (!(errType === ErrorType.Restart)) return [3 /*break*/, 9];
                        this.url = '';
                        this.status = 'queue';
                        return [3 /*break*/, 13];
                    case 9:
                        if (!(errType === ErrorType.Auth)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.getToken()];
                    case 10:
                        _c.sent();
                        return [3 /*break*/, 13];
                    case 11:
                        this.status = 'retry';
                        return [4 /*yield*/, this.errorHandler.wait()];
                    case 12:
                        _c.sent();
                        this.offset = this.responseStatus >= 400 ? undefined : this.offset;
                        this.status = 'uploading';
                        _c.label = 13;
                    case 13: return [3 /*break*/, 14];
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        this.progress = 100;
                        this.remaining = 0;
                        this.status = 'complete';
                        _c.label = 16;
                    case 16: return [3 /*break*/, 0];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Performs http requests
     */
    Uploader.prototype.request = function (_a) {
        var _this = this;
        var _b = _a.method, method = _b === void 0 ? 'GET' : _b, _c = _a.body, body = _c === void 0 ? null : _c, url = _a.url, _d = _a.headers, headers = _d === void 0 ? {} : _d, progress = _a.progress;
        return new Promise(function (resolve, reject) {
            var xhr = (_this._xhr = new XMLHttpRequest());
            xhr.open(method, url || _this.url, true);
            if (body instanceof Blob || (body && progress)) {
                xhr.upload.onprogress = _this.onProgress();
            }
            _this.responseStatus = 0;
            _this.response = undefined;
            _this.responseType && (xhr.responseType = _this.responseType);
            _this.options.withCredentials && (xhr.withCredentials = true);
            var _headers = tslib_1.__assign({}, _this.headers, headers);
            Object.keys(_headers).forEach(function (key) { return xhr.setRequestHeader(key, _headers[key]); });
            xhr.onload = function (evt) {
                _this.responseStatus = xhr.status;
                _this.response = _this.responseStatus !== 204 ? _this.getResponseBody(xhr) : '';
                _this.responseStatus >= 400 ? reject(evt) : resolve(evt);
            };
            xhr.onerror = reject;
            xhr.send(body);
        });
    };
    Uploader.prototype.setAuth = function (token) {
        this.headers.Authorization = "Bearer " + token;
    };
    Uploader.prototype.abort = function () {
        this.offset = undefined;
        this._xhr && this._xhr.abort();
    };
    Uploader.prototype.onCancel = function () {
        var _this = this;
        this.abort();
        var stateChange = function () { return _this.stateChange(_this); };
        if (this.url) {
            this.request({ method: 'DELETE' }).then(stateChange, stateChange);
        }
        else {
            stateChange();
        }
    };
    /**
     * Gets the value from the response
     */
    Uploader.prototype.getValueFromResponse = function (key) {
        return this._xhr.getResponseHeader(key);
    };
    /**
     * Set auth token
     */
    Uploader.prototype.getToken = function () {
        var _this = this;
        return Promise.resolve(unfunc(this.token || '', this.responseStatus)).then(function (token) { return token && _this.setAuth(token); });
    };
    Uploader.prototype.getChunk = function () {
        this.chunkSize = isNumber(this.options.chunkSize) ? this.chunkSize : DynamicChunk.size;
        var start = this.offset || 0;
        var end = Math.min(start + this.chunkSize, this.size);
        var body = this.file.slice(this.offset, end);
        return { start: start, end: end, body: body };
    };
    Uploader.prototype.getResponseBody = function (xhr) {
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        if (body && this.responseType === 'json' && typeof body === 'string') {
            try {
                body = JSON.parse(body);
            }
            catch (_a) { }
        }
        return body;
    };
    Uploader.prototype.onProgress = function () {
        var _this = this;
        var throttle = 0;
        return function (_a) {
            var loaded = _a.loaded;
            var now = new Date().getTime();
            var uploaded = _this.offset + loaded;
            var elapsedTime = (now - _this.startTime) / 1000;
            _this.speed = Math.round(uploaded / elapsedTime);
            DynamicChunk.scale(_this.speed);
            if (!throttle) {
                throttle = window.setTimeout(function () { return (throttle = 0); }, 500);
                _this.progress = +((uploaded / _this.size) * 100).toFixed(2);
                _this.remaining = Math.ceil((_this.size - uploaded) / _this.speed);
                _this.stateChange(_this);
            }
        };
    };
    return Uploader;
}());
export { Uploader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdXBsb2FkeC8iLCJzb3VyY2VzIjpbImxpYi91cGxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQVExRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRTNFLElBQU0saUJBQWlCLEdBQTBDO0lBQy9ELEtBQUssRUFBRSxRQUFRO0lBQ2YsTUFBTSxFQUFFLE9BQU87SUFDZixNQUFNLEVBQUUsV0FBVztJQUNuQixTQUFTLEVBQUUsT0FBTztJQUNsQixRQUFRLEVBQUUsUUFBUTtJQUNsQixTQUFTLEVBQUUsV0FBVztDQUN2QixDQUFDO0FBU0Y7O0dBRUc7QUFDSDtJQXFERSxrQkFBcUIsSUFBVSxFQUFXLE9BQXdCO1FBQWxFLGlCQWtCQztRQWxCb0IsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUFXLFlBQU8sR0FBUCxPQUFPLENBQWlCO1FBdkJsRSxxQkFBcUI7UUFDckIsWUFBTyxHQUF3QixFQUFFLENBQUM7UUFHbEMsc0JBQXNCO1FBQ3RCLGFBQVEsR0FBRyxTQUFTLENBQUM7UUFLckIsc0JBQXNCO1FBQ1osaUJBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzVDLHdDQUF3QztRQUM5QixXQUFNLEdBQUksQ0FBQyxDQUFDO1FBQ3RCLG1DQUFtQztRQUN6QixpQkFBWSxHQUErQixFQUFFLENBQUM7UUFDaEQsU0FBSSxHQUFHLEVBQUUsQ0FBQztRQTZMVixZQUFPLEdBQUcsY0FBTSxPQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUEzQixDQUEyQixDQUFDO1FBdkxsRCxJQUFJLENBQUMs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LENBQUM7UUFDakIsT0FBTyxVQUFDLEVBQXlCO2dCQUF2QixrQkFBTTtZQUNkLElBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDakMsSUFBTSxRQUFRLEdBQUksS0FBSSxDQUFDLE1BQWlCLEdBQUcsTUFBTSxDQUFDO1lBQ2xELElBQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDbEQsS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsQ0FBQztZQUNoRCxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQixJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNiLFFBQVEsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLGNBQU0sT0FBQSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsRUFBZCxDQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3hELEtBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNELEtBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNoRSxLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUksQ0FBQyxDQUFDO2FBQ3hCO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBelFELElBeVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXJyb3JIYW5kbGVyLCBFcnJvclR5cGUgfSBmcm9tICcuL2Vycm9yLWhhbmRsZXInO1xuaW1wb3J0IHtcbiAgVXBsb2FkQWN0aW9uLFxuICBVcGxvYWRlck9wdGlvbnMsXG4gIFVwbG9hZFN0YXRlLFxuICBVcGxvYWRTdGF0dXMsXG4gIFVwbG9hZHhDb250cm9sRXZlbnRcbn0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IHN0b3JlIH0gZnJvbSAnLi9zdG9yZSc7XG5pbXBvcnQgeyBjcmVhdGVIYXNoLCBEeW5hbWljQ2h1bmssIGlzTnVtYmVyLCBub29wLCB1bmZ1bmMgfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgYWN0aW9uVG9TdGF0dXNNYXA6IHsgW0sgaW4gVXBsb2FkQWN0aW9uXTogVXBsb2FkU3RhdHVzIH0gPSB7XG4gIHBhdXNlOiAncGF1c2VkJyxcbiAgdXBsb2FkOiAncXVldWUnLFxuICBjYW5jZWw6ICdjYW5jZWxsZWQnLFxuICB1cGxvYWRBbGw6ICdxdWV1ZScsXG4gIHBhdXNlQWxsOiAncGF1c2VkJyxcbiAgY2FuY2VsQWxsOiAnY2FuY2VsbGVkJ1xufTtcbmludGVyZmFjZSBSZXF1ZXN0UGFyYW1zIHtcbiAgbWV0aG9kOiAnR0VUJyB8ICdQT1NUJyB8ICdQVVQnIHwgJ0RFTEVURScgfCAnUEFUQ0gnIHwgJ0hFQUQnIHwgJ09QVElPTlMnO1xuICBib2R5PzogQm9keUluaXQgfCBudWxsO1xuICB1cmw/OiBzdHJpbmc7XG4gIGhlYWRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBwcm9ncmVzcz86IGJvb2xlYW47XG59XG5cbi8qKlxuICogVXBsb2FkZXIgQmFzZSBDbGFzc1xuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgVXBsb2FkZXIgaW1wbGVtZW50cyBVcGxvYWRTdGF0ZSB7XG4gIHNldCBzdGF0dXMoczogVXBsb2FkU3RhdHVzKSB7XG4gICAgaWYgKHRoaXMuX3N0YXR1cyA9PT0gJ2NhbmNlbGxlZCcgfHwgKHRoaXMuX3N0YXR1cyA9PT0gJ2NvbXBsZXRlJyAmJiBzICE9PSAnY2FuY2VsbGVkJykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHMgIT09IHRoaXMuX3N0YXR1cykge1xuICAgICAgcyA9PT0gJ3BhdXNlZCcgJiYgdGhpcy5hYm9ydCgpO1xuICAgICAgdGhpcy5fc3RhdHVzID0gcztcbiAgICAgIFsnY2FuY2VsbGVkJywgJ2NvbXBsZXRlJywgJ2Vycm9yJ10uaW5jbHVkZXMocykgJiYgdGhpcy5jbGVhbnVwKCk7XG4gICAgICBzID09PSAnY2FuY2VsbGVkJyA/IHRoaXMub25DYW5jZWwoKSA6IHRoaXMuc3RhdGVDaGFuZ2UodGhpcyk7XG4gICAgfVxuICB9XG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YXR1cztcbiAgfVxuICBnZXQgdXJsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3VybCB8fCBzdG9yZS5nZXQodGhpcy51cGxvYWRJZCkgfHwgJyc7XG4gIH1cbiAgc2V0IHVybCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXJsICE9PSB2YWx1ZSAmJiBzdG9yZS5zZXQodGhpcy51cGxvYWRJZCwgdmFsdWUpO1xuICAgIHRoaXMuX3VybCA9IHZhbHVlO1xuICB9XG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcbiAgcmVhZG9ubHkgc2l6ZTogbnVtYmVyO1xuICByZWFkb25seSB1cGxvYWRJZDogc3RyaW5nO1xuICByZXNwb25zZTogYW55O1xuICByZXNwb25zZVN0YXR1czogbnVtYmVyO1xuICBwcm9ncmVzczogbnVtYmVyO1xuICByZW1haW5pbmc6IG51bWJlcjtcbiAgc3BlZWQ6IG51bWJlcjtcbiAgLyoqIEN1c3RvbSBoZWFkZXJzICovXG4gIGhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fTtcbiAgLyoqIE1ldGFkYXRhIE9iamVjdCAqL1xuICBtZXRhZGF0YTogUmVjb3JkPHN0cmluZywgYW55PjtcbiAgLyoqIFVwbG9hZCBlbmRwb2ludCAqL1xuICBlbmRwb2ludCA9ICcvdXBsb2FkJztcbiAgLyoqIENodW5rIHNpemUgaW4gYnl0ZXMgKi9cbiAgY2h1bmtTaXplOiBudW1iZXI7XG4gIC8qKiBBdXRoIHRva2VuL3Rva2VuR2V0dGVyICovXG4gIHRva2VuOiBVcGxvYWR4Q29udHJvbEV2ZW50Wyd0b2tlbiddO1xuICAvKiogUmV0cmllcyBoYW5kbGVyICovXG4gIHByb3RlY3RlZCBlcnJvckhhbmRsZXIgPSBuZXcgRXJyb3JIYW5kbGVyKCk7XG4gIC8qKiBBY3RpdmUgSHR0cFJlcXVlc3QgKi9cbiAgcHJvdGVjdGVkIF94aHI6IFhNTEh0dHBSZXF1ZXN0O1xuICAvKiogYnl0ZSBvZmZzZXQgd2l0aGluIHRoZSB3aG9sZSBmaWxlICovXG4gIHByb3RlY3RlZCBvZmZzZXQ/ID0gMDtcbiAgLyoqIFNldCBIdHRwUmVxdWVzdCByZXNwb25zZVR5cGUgKi9cbiAgcHJvdGVjdGVkIHJlc3BvbnNlVHlwZTogWE1MSHR0cFJlcXVlc3RSZXNwb25zZVR5cGUgPSAnJztcbiAgcHJpdmF0ZSBfdXJsID0gJyc7XG4gIHByaXZhdGUgX3N0YXR1czogVXBsb2FkU3RhdHVzO1xuICBwcml2YXRlIHN0YXJ0VGltZTogbnVtYmVyO1xuICBwcml2YXRlIHN0YXRlQ2hhbmdlOiAoZXZ0OiBVcGxvYWRTdGF0ZSkgPT4gdm9pZDtcblxuICBjb25zdHJ1Y3RvcihyZWFkb25seSBmaWxlOiBGaWxlLCByZWFkb25seSBvcHRpb25zOiBVcGxvYWRlck9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBmaWxlLm5hbWU7XG4gICAgdGhpcy5zaXplID0gZmlsZS5zaXplO1xuICAgIHRoaXMubWV0YWRhdGEgPSB7XG4gICAgICBuYW1lOiBmaWxlLm5hbWUsXG4gICAgICBtaW1lVHlwZTogZmlsZS50eXBlIHx8ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICAgICAgc2l6ZTogZmlsZS5zaXplLFxuICAgICAgbGFzdE1vZGlmaWVkOiBmaWxlLmxhc3RNb2RpZmllZFxuICAgIH07XG4gICAgY29uc3QgcHJpbnQgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAuLi50aGlzLm1ldGFkYXRhLFxuICAgICAgdHlwZTogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgZW5kcG9pbnQ6IG9wdGlvbnMuZW5kcG9pbnRcbiAgICB9KTtcbiAgICB0aGlzLnVwbG9hZElkID0gY3JlYXRlSGFzaChwcmludCkudG9TdHJpbmcoMTYpO1xuICAgIHRoaXMuc3RhdGVDaGFuZ2UgPSBvcHRpb25zLnN0YXRlQ2hhbmdlIHx8IG5vb3A7XG4gICAgdGhpcy5jaHVua1NpemUgPSBvcHRpb25zLmNodW5rU2l6ZSB8fCB0aGlzLnNpemU7XG4gICAgdGhpcy5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHVwbG9hZGVyXG4gICAqL1xuICBjb25maWd1cmUoeyBtZXRhZGF0YSA9IHt9LCBoZWFkZXJzID0ge30sIHRva2VuLCBlbmRwb2ludCwgYWN0aW9uIH06IFVwbG9hZHhDb250cm9sRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmVuZHBvaW50ID0gZW5kcG9pbnQgfHwgdGhpcy5lbmRwb2ludDtcbiAgICB0aGlzLnRva2VuID0gdG9rZW4gfHwgdGhpcy50b2tlbjtcbiAgICB0aGlzLm1ldGFkYXRhID0geyAuLi50aGlzLm1ldGFkYXRhLCAuLi51bmZ1bmMobWV0YWRhdGEsIHRoaXMuZmlsZSkgfTtcbiAgICB0aGlzLmhlYWRlcnMgPSB7IC4uLnRoaXMuaGVhZGVycywgLi4udW5mdW5jKGhlYWRlcnMsIHRoaXMuZmlsZSkgfTtcbiAgICBhY3Rpb24gJiYgKHRoaXMuc3RhdHVzID0gYWN0aW9uVG9TdGF0dXNNYXBbYWN0aW9uXSk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHVwbG9hZGluZ1xuICAgKi9cbiAgYXN5bmMgdXBsb2FkKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuc3RhdHVzID0gJ3VwbG9hZGluZyc7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHRoaXMuZ2V0VG9rZW4oKTtcbiAgICAgIHRoaXMub2Zmc2V0ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHRoaXMudXJsID0gdGhpcy51cmwgfHwgKGF3YWl0IHRoaXMuZ2V0RmlsZVVybCgpKTtcbiAgICAgIHRoaXMuZXJyb3JIYW5kbGVyLnJlc2V0KCk7XG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfSBjYXRjaCB7XG4gICAgICBpZiAodGhpcy5lcnJvckhhbmRsZXIua2luZCh0aGlzLnJlc3BvbnNlU3RhdHVzKSAhPT0gRXJyb3JUeXBlLkZhdGFsRXJyb3IpIHtcbiAgICAgICAgdGhpcy5zdGF0dXMgPSAncmV0cnknO1xuICAgICAgICBhd2FpdCB0aGlzLmVycm9ySGFuZGxlci53YWl0KCk7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ3F1ZXVlJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ2Vycm9yJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIGNodW5rIHVwbG9hZFxuICAgKi9cbiAgYXN5bmMgc3RhcnQoKSB7XG4gICAgd2hpbGUgKHRoaXMuc3RhdHVzID09PSAndXBsb2FkaW5nJyB8fCB0aGlzLnN0YXR1cyA9PT0gJ3JldHJ5Jykge1xuICAgICAgaWYgKHRoaXMub2Zmc2V0ICE9PSB0aGlzLnNpemUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBvZmZzZXQgPSBpc051bWJlcih0aGlzLm9mZnNldClcbiAgICAgICAgICAgID8gYXdhaXQgdGhpcy5zZW5kRmlsZUNvbnRlbnQoKVxuICAgICAgICAgICAgOiBhd2FpdCB0aGlzLmdldE9mZnNldCgpO1xuICAgICAgICAgIGlmIChvZmZzZXQgPT09IHRoaXMub2Zmc2V0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnRlbnQgdXBsb2FkIGZhaWxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmVycm9ySGFuZGxlci5yZXNldCgpO1xuICAgICAgICAgIHRoaXMub2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICBjb25zdCBlcnJUeXBlID0gdGhpcy5lcnJvckhhbmRsZXIua2luZCh0aGlzLnJlc3BvbnNlU3RhdHVzKTtcbiAgICAgICAgICBpZiAodGhpcy5yZXNwb25zZVN0YXR1cyA9PT0gNDEzKSB7XG4gICAgICAgICAgICBEeW5hbWljQ2h1bmsubWF4U2l6ZSA9IHRoaXMuY2h1bmtTaXplIC89IDI7XG4gICAgICAgICAgfSBlbHNlIGlmIChlcnJUeXBlID09PSBFcnJvclR5cGUuRmF0YWxFcnJvcikge1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSAnZXJyb3InO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZXJyVHlwZSA9PT0gRXJyb3JUeXBlLlJlc3RhcnQpIHtcbiAgICAgICAgICAgIHRoaXMudXJsID0gJyc7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdxdWV1ZSc7XG4gICAgICAgICAgfSBlbHNlIGlmIChlcnJUeXBlID09PSBFcnJvclR5cGUuQXV0aCkge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5nZXRUb2tlbigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICdyZXRyeSc7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmVycm9ySGFuZGxlci53YWl0KCk7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IHRoaXMucmVzcG9uc2VTdGF0dXMgPj0gNDAwID8gdW5kZWZpbmVkIDogdGhpcy5vZmZzZXQ7XG4gICAgICAgICAgICB0aGlzLnN0YXR1cyA9ICd1cGxvYWRpbmcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgICAgICAgdGhpcy5yZW1haW5pbmcgPSAwO1xuICAgICAgICB0aGlzLnN0YXR1cyA9ICdjb21wbGV0ZSc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFBlcmZvcm1zIGh0dHAgcmVxdWVzdHNcbiAgICovXG4gIHJlcXVlc3Qoe1xuICAgIG1ldGhvZCA9ICdHRVQnLFxuICAgIGJvZHkgPSBudWxsLFxuICAgIHVybCxcbiAgICBoZWFkZXJzID0ge30sXG4gICAgcHJvZ3Jlc3NcbiAgfTogUmVxdWVzdFBhcmFtcyk6IFByb21pc2U8UHJvZ3Jlc3NFdmVudD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB4aHIgPSAodGhpcy5feGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCkpO1xuICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwgfHwgdGhpcy51cmwsIHRydWUpO1xuICAgICAgaWYgKGJvZHkgaW5zdGFuY2VvZiBCbG9iIHx8IChib2R5ICYmIHByb2dyZXNzKSkge1xuICAgICAgICB4aHIudXBsb2FkLm9ucHJvZ3Jlc3MgPSB0aGlzLm9uUHJvZ3Jlc3MoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVzcG9uc2VTdGF0dXMgPSAwO1xuICAgICAgdGhpcy5yZXNwb25zZSA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMucmVzcG9uc2VUeXBlICYmICh4aHIucmVzcG9uc2VUeXBlID0gdGhpcy5yZXNwb25zZVR5cGUpO1xuICAgICAgdGhpcy5vcHRpb25zLndpdGhDcmVkZW50aWFscyAmJiAoeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWUpO1xuICAgICAgY29uc3QgX2hlYWRlcnMgPSB7IC4uLnRoaXMuaGVhZGVycywgLi4uaGVhZGVycyB9O1xuICAgICAgT2JqZWN0LmtleXMoX2hlYWRlcnMpLmZvckVhY2goa2V5ID0+IHhoci5zZXRSZXF1ZXN0SGVhZGVyKGtleSwgX2hlYWRlcnNba2V5XSkpO1xuICAgICAgeGhyLm9ubG9hZCA9IChldnQ6IFByb2dyZXNzRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5yZXNwb25zZVN0YXR1cyA9IHhoci5zdGF0dXM7XG4gICAgICAgIHRoaXMucmVzcG9uc2UgPSB0aGlzLnJlc3BvbnNlU3RhdHVzICE9PSAyMDQgPyB0aGlzLmdldFJlc3BvbnNlQm9keSh4aHIpIDogJyc7XG4gICAgICAgIHRoaXMucmVzcG9uc2VTdGF0dXMgPj0gNDAwID8gcmVqZWN0KGV2dCkgOiByZXNvbHZlKGV2dCk7XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSByZWplY3Q7XG4gICAgICB4aHIuc2VuZChib2R5KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgZmlsZSBVUklcbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBnZXRGaWxlVXJsKCk6IFByb21pc2U8c3RyaW5nPjtcblxuICAvKipcbiAgICogU2VuZCBmaWxlIGNvbnRlbnQgYW5kIHJldHVybiBhbiBvZmZzZXQgZm9yIHRoZSBuZXh0IHJlcXVlc3RcbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBzZW5kRmlsZUNvbnRlbnQoKTogUHJvbWlzZTxudW1iZXIgfCB1bmRlZmluZWQ+O1xuXG4gIC8qKlxuICAgKiBHZXQgYW4gb2Zmc2V0IGZvciB0aGUgbmV4dCByZXF1ZXN0XG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgZ2V0T2Zmc2V0KCk6IFByb21pc2U8bnVtYmVyIHwgdW5kZWZpbmVkPjtcblxuICBwcm90ZWN0ZWQgc2V0QXV0aCh0b2tlbjogc3RyaW5nKSB7XG4gICAgdGhpcy5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSBgQmVhcmVyICR7dG9rZW59YDtcbiAgfVxuXG4gIHByb3RlY3RlZCBhYm9ydCgpOiB2b2lkIHtcbiAgICB0aGlzLm9mZnNldCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl94aHIgJiYgdGhpcy5feGhyLmFib3J0KCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25DYW5jZWwoKTogdm9pZCB7XG4gICAgdGhpcy5hYm9ydCgpO1xuICAgIGNvbnN0IHN0YXRlQ2hhbmdlID0gKCkgPT4gdGhpcy5zdGF0ZUNoYW5nZSh0aGlzKTtcbiAgICBpZiAodGhpcy51cmwpIHtcbiAgICAgIHRoaXMucmVxdWVzdCh7IG1ldGhvZDogJ0RFTEVURScgfSkudGhlbihzdGF0ZUNoYW5nZSwgc3RhdGVDaGFuZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZUNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB2YWx1ZSBmcm9tIHRoZSByZXNwb25zZVxuICAgKi9cbiAgcHJvdGVjdGVkIGdldFZhbHVlRnJvbVJlc3BvbnNlKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX3hoci5nZXRSZXNwb25zZUhlYWRlcihrZXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCBhdXRoIHRva2VuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0VG9rZW4oKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVuZnVuYyh0aGlzLnRva2VuIHx8ICcnLCB0aGlzLnJlc3BvbnNlU3RhdHVzKSkudGhlbihcbiAgICAgIHRva2VuID0+IHRva2VuICYmIHRoaXMuc2V0QXV0aCh0b2tlbilcbiAgICApO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldENodW5rKCkge1xuICAgIHRoaXMuY2h1bmtTaXplID0gaXNOdW1iZXIodGhpcy5vcHRpb25zLmNodW5rU2l6ZSkgPyB0aGlzLmNodW5rU2l6ZSA6IER5bmFtaWNDaHVuay5zaXplO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5vZmZzZXQgfHwgMDtcbiAgICBjb25zdCBlbmQgPSBNYXRoLm1pbihzdGFydCArIHRoaXMuY2h1bmtTaXplLCB0aGlzLnNpemUpO1xuICAgIGNvbnN0IGJvZHkgPSB0aGlzLmZpbGUuc2xpY2UodGhpcy5vZmZzZXQsIGVuZCk7XG4gICAgcmV0dXJuIHsgc3RhcnQsIGVuZCwgYm9keSB9O1xuICB9XG4gIHByaXZhdGUgY2xlYW51cCA9ICgpID0+IHN0b3JlLmRlbGV0ZSh0aGlzLnVwbG9hZElkKTtcblxuICBwcml2YXRlIGdldFJlc3BvbnNlQm9keSh4aHI6IFhNTEh0dHBSZXF1ZXN0KTogYW55IHtcbiAgICBsZXQgYm9keSA9ICdyZXNwb25zZScgaW4gKHhociBhcyBhbnkpID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dDtcbiAgICBpZiAoYm9keSAmJiB0aGlzLnJlc3BvbnNlVHlwZSA9PT0gJ2pzb24nICYmIHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYm9keSA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfVxuICAgIHJldHVybiBib2R5O1xuICB9XG5cbiAgcHJpdmF0ZSBvblByb2dyZXNzKCk6IChldnQ6IFByb2dyZXNzRXZlbnQpID0+IHZvaWQge1xuICAgIGxldCB0aHJvdHRsZSA9IDA7XG4gICAgcmV0dXJuICh7IGxvYWRlZCB9OiBQcm9ncmVzc0V2ZW50KSA9PiB7XG4gICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIGNvbnN0IHVwbG9hZGVkID0gKHRoaXMub2Zmc2V0IGFzIG51bWJlcikgKyBsb2FkZWQ7XG4gICAgICBjb25zdCBlbGFwc2VkVGltZSA9IChub3cgLSB0aGlzLnN0YXJ0VGltZSkgLyAxMDAwO1xuICAgICAgdGhpcy5zcGVlZCA9IE1hdGgucm91bmQodXBsb2FkZWQgLyBlbGFwc2VkVGltZSk7XG4gICAgICBEeW5hbWljQ2h1bmsuc2NhbGUodGhpcy5zcGVlZCk7XG4gICAgICBpZiAoIXRocm90dGxlKSB7XG4gICAgICAgIHRocm90dGxlID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4gKHRocm90dGxlID0gMCksIDUwMCk7XG4gICAgICAgIHRoaXMucHJvZ3Jlc3MgPSArKCh1cGxvYWRlZCAvIHRoaXMuc2l6ZSkgKiAxMDApLnRvRml4ZWQoMik7XG4gICAgICAgIHRoaXMucmVtYWluaW5nID0gTWF0aC5jZWlsKCh0aGlzLnNpemUgLSB1cGxvYWRlZCkgLyB0aGlzLnNwZWVkKTtcbiAgICAgICAgdGhpcy5zdGF0ZUNoYW5nZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG4iXX0=