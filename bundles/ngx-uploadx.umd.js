(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('ngx-uploadx', ['exports', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['ngx-uploadx'] = {}, global.ng.core, global.rxjs, global.rxjs.operators));
}(this, (function (exports, core, rxjs, operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    /**
     * @internal
     */

    (function (ErrorType) {
        ErrorType[ErrorType["Restart"] = 0] = "Restart";
        ErrorType[ErrorType["Auth"] = 1] = "Auth";
        ErrorType[ErrorType["Retryable"] = 2] = "Retryable";
        ErrorType[ErrorType["FatalError"] = 3] = "FatalError";
    })(exports.ErrorType || (exports.ErrorType = {}));
    var ErrorHandler = /** @class */ (function () {
        function ErrorHandler() {
            this.min = 500;
            this.max = this.min * 120;
            this.factor = 2;
            this.attempts = 1;
            this.code = -1;
            this.delay = this.min;
        }
        ErrorHandler.prototype.kind = function (code) {
            if (code === this.code) {
                this.attempts++;
                if (this.attempts > ErrorHandler.maxAttempts) {
                    return exports.ErrorType.FatalError;
                }
            }
            else {
                this.reset();
            }
            this.code = code;
            if (ErrorHandler.authErrorCodes.includes(code)) {
                return exports.ErrorType.Auth;
            }
            if (ErrorHandler.shouldRestartCodes.includes(code)) {
                return exports.ErrorType.Restart;
            }
            if (code < 400 || code >= 500 || ErrorHandler.shouldRetryCodes.includes(code)) {
                return exports.ErrorType.Retryable;
            }
            return exports.ErrorType.FatalError;
        };
        ErrorHandler.prototype.wait = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.delay = Math.min(_this.delay * _this.factor, _this.max);
                setTimeout(function () { return resolve(_this.attempts); }, _this.delay + Math.floor(Math.random() * _this.min));
            });
        };
        ErrorHandler.prototype.reset = function () {
            this.delay = this.min;
            this.attempts = 1;
            this.code = -1;
        };
        ErrorHandler.maxAttempts = 8;
        ErrorHandler.shouldRestartCodes = [404, 410];
        ErrorHandler.authErrorCodes = [401];
        ErrorHandler.shouldRetryCodes = [423, 429];
        return ErrorHandler;
    }());

    var Store = /** @class */ (function () {
        function Store(prefix) {
            if (prefix === void 0) { prefix = 'UPLOADX-V3.0-'; }
            this.prefix = prefix;
        }
        Store.prototype.set = function (key, value) {
            localStorage.setItem(this.prefix + key, value);
        };
        Store.prototype.get = function (key) {
            return localStorage.getItem(this.prefix + key);
        };
        Store.prototype.delete = function (key) {
            localStorage.removeItem(this.prefix + key);
        };
        return Store;
    }());
    var store = 'localStorage' in window ? new Store() : new Map();

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
    var noop = function () { };
    var pick = function (obj, whitelist) {
        var result = {};
        whitelist.forEach(function (key) { return (result[key] = obj[key]); });
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
        var hash = 2166136261;
        var len = str.length;
        for (var i = 0; i < len; i++) {
            hash ^= str.charCodeAt(i);
            hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
        }
        return hash >>> 0;
    }
    var b64 = {
        encode: function (str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                return String.fromCharCode(Number.parseInt(p1, 16));
            }));
        },
        decode: function (str) {
            return decodeURIComponent(atob(str)
                .split('')
                .map(function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); })
                .join(''));
        },
        serialize: function (obj) {
            return Object.entries(obj)
                .map(function (_a) {
                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                return key + " " + b64.encode(String(value));
            })
                .toString();
        },
        parse: function (encoded) {
            var e_1, _a;
            var kvPairs = encoded.split(',').map(function (kv) { return kv.split(' '); });
            var decoded = Object.create(null);
            try {
                for (var kvPairs_1 = __values(kvPairs), kvPairs_1_1 = kvPairs_1.next(); !kvPairs_1_1.done; kvPairs_1_1 = kvPairs_1.next()) {
                    var _b = __read(kvPairs_1_1.value, 2), key = _b[0], value = _b[1];
                    decoded[key] = b64.decode(value);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (kvPairs_1_1 && !kvPairs_1_1.done && (_a = kvPairs_1.return)) _a.call(kvPairs_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return decoded;
        }
    };
    /**
     * Adaptive chunk size
     */
    var DynamicChunk = /** @class */ (function () {
        function DynamicChunk() {
        }
        DynamicChunk.scale = function (throughput) {
            var elapsedTime = DynamicChunk.size / throughput;
            if (elapsedTime < DynamicChunk.minChunkTime) {
                DynamicChunk.size = Math.min(DynamicChunk.maxSize, DynamicChunk.size * 2);
            }
            if (elapsedTime > DynamicChunk.maxChunkTime) {
                DynamicChunk.size = Math.max(DynamicChunk.minSize, DynamicChunk.size / 2);
            }
            return DynamicChunk.size;
        };
        /** Maximum chunk size in bytes */
        DynamicChunk.maxSize = Number.MAX_SAFE_INTEGER;
        /** Minimum chunk size in bytes */
        DynamicChunk.minSize = 1024 * 256;
        /** Initial chunk size in bytes */
        DynamicChunk.size = 4096 * 256;
        DynamicChunk.minChunkTime = 2;
        DynamicChunk.maxChunkTime = 8;
        return DynamicChunk;
    }());

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
            var print = JSON.stringify(__assign({}, this.metadata, { type: this.constructor.name, endpoint: options.endpoint }));
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
            this.metadata = __assign({}, this.metadata, unfunc(metadata, this.file));
            this.headers = __assign({}, this.headers, unfunc(headers, this.file));
            action && (this.status = actionToStatusMap[action]);
        };
        /**
         * Starts uploading
         */
        Uploader.prototype.upload = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _c;
                return __generator(this, function (_d) {
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
                            if (!(this.errorHandler.kind(this.responseStatus) !== exports.ErrorType.FatalError)) return [3 /*break*/, 7];
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
            return __awaiter(this, void 0, void 0, function () {
                var offset, _a, _b, errType;
                return __generator(this, function (_c) {
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
                            if (!(errType === exports.ErrorType.FatalError)) return [3 /*break*/, 8];
                            this.status = 'error';
                            return [3 /*break*/, 13];
                        case 8:
                            if (!(errType === exports.ErrorType.Restart)) return [3 /*break*/, 9];
                            this.url = '';
                            this.status = 'queue';
                            return [3 /*break*/, 13];
                        case 9:
                            if (!(errType === exports.ErrorType.Auth)) return [3 /*break*/, 11];
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
                var _headers = __assign({}, _this.headers, headers);
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

    /**
     * Implements tus resumable upload protocol
     * @see
     * https://github.com/tus/tus-resumable-upload-protocol/blob/master/protocol.md
     */
    var Tus = /** @class */ (function (_super) {
        __extends(Tus, _super);
        function Tus() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.headers = { 'Tus-Resumable': '1.0.0' };
            return _this;
        }
        Tus.prototype.getFileUrl = function () {
            return __awaiter(this, void 0, void 0, function () {
                var encodedMetaData, headers, location;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            encodedMetaData = b64.serialize(this.metadata);
                            headers = {
                                'Upload-Length': "" + this.size,
                                'Upload-Metadata': "" + encodedMetaData
                            };
                            return [4 /*yield*/, this.request({ method: 'POST', url: this.endpoint, headers: headers })];
                        case 1:
                            _a.sent();
                            location = this.getValueFromResponse('location');
                            if (!location) {
                                throw new Error('Invalid or missing Location header');
                            }
                            this.offset = this.responseStatus === 201 ? 0 : undefined;
                            return [2 /*return*/, resolveUrl(location, this.endpoint)];
                    }
                });
            });
        };
        Tus.prototype.sendFileContent = function () {
            return __awaiter(this, void 0, void 0, function () {
                var body, headers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            body = this.getChunk().body;
                            headers = {
                                'Content-Type': 'application/offset+octet-stream',
                                'Upload-Offset': "" + this.offset
                            };
                            return [4 /*yield*/, this.request({ method: 'PATCH', body: body, headers: headers })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.getOffsetFromResponse()];
                    }
                });
            });
        };
        Tus.prototype.getOffset = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.request({ method: 'HEAD' })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.getOffsetFromResponse()];
                    }
                });
            });
        };
        Tus.prototype.getOffsetFromResponse = function () {
            var offsetStr = this.getValueFromResponse('Upload-Offset');
            return offsetStr ? parseInt(offsetStr, 10) : undefined;
        };
        return Tus;
    }(Uploader));

    /**
     * Implements XHR/CORS Resumable Upload
     * @see
     * https://developers.google.com/drive/api/v3/manage-uploads#resumable
     */
    var UploaderX = /** @class */ (function (_super) {
        __extends(UploaderX, _super);
        function UploaderX() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.responseType = 'json';
            return _this;
        }
        UploaderX.prototype.getFileUrl = function () {
            return __awaiter(this, void 0, void 0, function () {
                var headers, location;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = {
                                'Content-Type': 'application/json; charset=utf-8',
                                'X-Upload-Content-Length': this.size.toString(),
                                'X-Upload-Content-Type': this.file.type || 'application/octet-stream',
                                'ngsw-bypass': 'true'
                            };
                            return [4 /*yield*/, this.request({
                                    method: 'POST',
                                    body: JSON.stringify(this.metadata),
                                    url: this.endpoint,
                                    headers: headers
                                })];
                        case 1:
                            _a.sent();
                            location = this.getValueFromResponse('location');
                            if (!location) {
                                throw new Error('Invalid or missing Location header');
                            }
                            this.offset = this.responseStatus === 201 ? 0 : undefined;
                            return [2 /*return*/, resolveUrl(location, this.endpoint)];
                    }
                });
            });
        };
        UploaderX.prototype.sendFileContent = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, end, body, headers;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = this.getChunk(), end = _a.end, body = _a.body;
                            headers = {
                                'Content-Type': 'application/octet-stream',
                                'Content-Range': "bytes " + this.offset + "-" + (end - 1) + "/" + this.size,
                                'ngsw-bypass': 'true'
                            };
                            return [4 /*yield*/, this.request({ method: 'PUT', body: body, headers: headers })];
                        case 1:
                            _b.sent();
                            return [2 /*return*/, this.getOffsetFromResponse()];
                    }
                });
            });
        };
        UploaderX.prototype.getOffset = function () {
            return __awaiter(this, void 0, void 0, function () {
                var headers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = {
                                'Content-Type': 'application/octet-stream',
                                'Content-Range': "bytes */" + this.size,
                                'ngsw-bypass': 'true'
                            };
                            return [4 /*yield*/, this.request({ method: 'PUT', headers: headers })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this.getOffsetFromResponse()];
                    }
                });
            });
        };
        UploaderX.prototype.getOffsetFromResponse = function () {
            if (this.responseStatus > 201) {
                var range = this.getValueFromResponse('Range');
                return range ? getRangeEnd(range) + 1 : undefined;
            }
            if (this.responseStatus <= 201) {
                return this.size;
            }
        };
        return UploaderX;
    }(Uploader));
    function getRangeEnd(range) {
        if (range === void 0) { range = ''; }
        var end = +range.split(/0-/)[1];
        return end >= 0 ? end : -1;
    }

    var UploadxService = /** @class */ (function () {
        function UploadxService(ngZone) {
            var _this = this;
            this.ngZone = ngZone;
            /** Upload Queue */
            this.queue = [];
            this.options = {
                endpoint: '/upload',
                autoUpload: true,
                concurrency: 2,
                stateChange: function (evt) {
                    setTimeout(function () {
                        return _this.ngZone.run(function () { return _this.eventsStream.next(pick(evt, UploadxService_1.stateKeys)); });
                    });
                }
            };
            this.eventsStream = new rxjs.Subject();
            this.subs = [];
            this.subs.push(rxjs.fromEvent(window, 'online').subscribe(function () { return _this.control({ action: 'upload' }); }), rxjs.fromEvent(window, 'offline').subscribe(function () { return _this.control({ action: 'pause' }); }), this.events.subscribe(function (_a) {
                var status = _a.status;
                if (status !== 'uploading' && status !== 'added') {
                    _this.ngZone.runOutsideAngular(function () { return _this.processQueue(); });
                }
            }));
        }
        UploadxService_1 = UploadxService;
        Object.defineProperty(UploadxService.prototype, "events", {
            /** Upload status events */
            get: function () {
                return this.eventsStream.asObservable();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Initializes service
         * @param options global module options
         * @returns Observable that emits a new value on progress or status changes
         */
        UploadxService.prototype.init = function (options) {
            if (options === void 0) { options = {}; }
            Object.assign(this.options, options);
            return this.events;
        };
        /**
         * Initializes service
         * @param options global module options
         * @returns Observable that emits the current array of uploaders
         */
        UploadxService.prototype.connect = function (options) {
            var _this = this;
            return this.init(options).pipe(operators.startWith(0), operators.map(function () { return _this.queue; }));
        };
        /**
         * Terminates all uploads and clears the queue
         */
        UploadxService.prototype.disconnect = function () {
            this.queue.forEach(function (uploader) { return (uploader.status = 'paused'); });
            this.queue = [];
        };
        UploadxService.prototype.ngOnDestroy = function () {
            this.disconnect();
            this.subs.forEach(function (sub) { return sub.unsubscribe(); });
        };
        /**
         * Create Uploader and add to the queue
         */
        UploadxService.prototype.handleFileList = function (fileList, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var instanceOptions = __assign({}, this.options, options);
            this.options.concurrency = instanceOptions.concurrency;
            Array.from(fileList).forEach(function (file) { return _this.addUploaderInstance(file, instanceOptions); });
            this.autoUploadFiles();
        };
        /**
         * Create Uploader for the file and add to the queue
         */
        UploadxService.prototype.handleFile = function (file, options) {
            if (options === void 0) { options = {}; }
            var instanceOptions = __assign({}, this.options, options);
            this.addUploaderInstance(file, instanceOptions);
            this.autoUploadFiles();
        };
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
        UploadxService.prototype.control = function (evt) {
            var target = evt.uploadId
                ? this.queue.filter(function (_a) {
                    var uploadId = _a.uploadId;
                    return uploadId === evt.uploadId;
                })
                : this.queue;
            target.forEach(function (uploader) { return uploader.configure(evt); });
        };
        /**
         * Returns number of active uploads
         */
        UploadxService.prototype.runningProcess = function () {
            return this.queue.filter(function (_a) {
                var status = _a.status;
                return status === 'uploading' || status === 'retry';
            }).length;
        };
        UploadxService.prototype.addUploaderInstance = function (file, options) {
            var uploader = new (options.uploaderClass || UploaderX)(file, options);
            this.queue.push(uploader);
            uploader.status = 'added';
        };
        UploadxService.prototype.autoUploadFiles = function () {
            if (this.options.autoUpload && window.navigator.onLine) {
                this.queue
                    .filter(function (_a) {
                    var status = _a.status;
                    return status === 'added';
                })
                    .forEach(function (uploader) { return (uploader.status = 'queue'); });
            }
        };
        UploadxService.prototype.processQueue = function () {
            this.queue = this.queue.filter(function (_a) {
                var status = _a.status;
                return status !== 'cancelled';
            });
            this.queue
                .filter(function (_a) {
                var status = _a.status;
                return status === 'queue';
            })
                .slice(0, Math.max(this.options.concurrency - this.runningProcess(), 0))
                .forEach(function (uploader) { return uploader.upload(); });
        };
        var UploadxService_1;
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
        UploadxService.ctorParameters = function () { return [
            { type: core.NgZone }
        ]; };
        UploadxService.ngInjectableDef = core.defineInjectable({ factory: function UploadxService_Factory() { return new UploadxService(core.inject(core.NgZone)); }, token: UploadxService, providedIn: "root" });
        UploadxService = UploadxService_1 = __decorate([
            core.Injectable({ providedIn: 'root' })
        ], UploadxService);
        return UploadxService;
    }());

    var UploadxDirective = /** @class */ (function () {
        function UploadxDirective(elementRef, renderer, uploadService) {
            this.elementRef = elementRef;
            this.renderer = renderer;
            this.uploadService = uploadService;
            this.uploadxState = new core.EventEmitter();
        }
        Object.defineProperty(UploadxDirective.prototype, "uploadxAction", {
            set: function (ctrlEvent) {
                if (ctrlEvent && this.uploadService) {
                    this.uploadService.control(ctrlEvent);
                }
            },
            enumerable: true,
            configurable: true
        });
        UploadxDirective.prototype.ngOnInit = function () {
            var _a = this.uploadx, multiple = _a.multiple, allowedTypes = _a.allowedTypes;
            multiple !== false && this.renderer.setAttribute(this.elementRef.nativeElement, 'multiple', '');
            allowedTypes &&
                this.renderer.setAttribute(this.elementRef.nativeElement, 'accept', allowedTypes);
            this.uploadxState.emit(this.uploadService.events);
        };
        UploadxDirective.prototype.fileListener = function (files) {
            if (files && files.item(0)) {
                this.uploadService.handleFileList(files, this.uploadx);
            }
        };
        UploadxDirective.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer2 },
            { type: UploadxService }
        ]; };
        __decorate([
            core.Output()
        ], UploadxDirective.prototype, "uploadxState", void 0);
        __decorate([
            core.Input()
        ], UploadxDirective.prototype, "uploadx", void 0);
        __decorate([
            core.Input()
        ], UploadxDirective.prototype, "uploadxAction", null);
        __decorate([
            core.HostListener('change', ['$event.target.files'])
        ], UploadxDirective.prototype, "fileListener", null);
        UploadxDirective = __decorate([
            core.Directive({ selector: '[uploadx]' })
        ], UploadxDirective);
        return UploadxDirective;
    }());

    var UploadxDropDirective = /** @class */ (function () {
        function UploadxDropDirective(uploadService) {
            this.uploadService = uploadService;
            this.active = false;
        }
        UploadxDropDirective.prototype.dropHandler = function (event) {
            if (event.dataTransfer && event.dataTransfer.files) {
                event.stopPropagation();
                event.preventDefault();
                this.active = false;
                if (event.dataTransfer.files.item(0)) {
                    this.uploadService.handleFileList(event.dataTransfer.files, this.fileInput.uploadx);
                }
            }
        };
        UploadxDropDirective.prototype.onDragOver = function (event) {
            if (event.dataTransfer && event.dataTransfer.files) {
                event.dataTransfer.dropEffect = 'copy';
                event.stopPropagation();
                event.preventDefault();
                this.active = true;
            }
        };
        UploadxDropDirective.prototype.onDragLeave = function (event) {
            this.active = false;
        };
        UploadxDropDirective.ctorParameters = function () { return [
            { type: UploadxService }
        ]; };
        __decorate([
            core.HostBinding('class.uploadx-drop-active')
        ], UploadxDropDirective.prototype, "active", void 0);
        __decorate([
            core.ContentChild(UploadxDirective)
        ], UploadxDropDirective.prototype, "fileInput", void 0);
        __decorate([
            core.HostListener('drop', ['$event'])
        ], UploadxDropDirective.prototype, "dropHandler", null);
        __decorate([
            core.HostListener('dragover', ['$event'])
        ], UploadxDropDirective.prototype, "onDragOver", null);
        __decorate([
            core.HostListener('dragleave', ['$event'])
        ], UploadxDropDirective.prototype, "onDragLeave", null);
        UploadxDropDirective = __decorate([
            core.Directive({ selector: '[uploadxDrop]' })
        ], UploadxDropDirective);
        return UploadxDropDirective;
    }());

    var UploadxModule = /** @class */ (function () {
        function UploadxModule() {
        }
        UploadxModule = __decorate([
            core.NgModule({
                declarations: [UploadxDirective, UploadxDropDirective],
                exports: [UploadxDirective, UploadxDropDirective]
            })
        ], UploadxModule);
        return UploadxModule;
    }());

    exports.DynamicChunk = DynamicChunk;
    exports.ErrorHandler = ErrorHandler;
    exports.Tus = Tus;
    exports.Uploader = Uploader;
    exports.UploaderX = UploaderX;
    exports.UploadxDirective = UploadxDirective;
    exports.UploadxDropDirective = UploadxDropDirective;
    exports.UploadxModule = UploadxModule;
    exports.UploadxService = UploadxService;
    exports.b64 = b64;
    exports.createHash = createHash;
    exports.getRangeEnd = getRangeEnd;
    exports.isNumber = isNumber;
    exports.isString = isString;
    exports.noop = noop;
    exports.pick = pick;
    exports.resolveUrl = resolveUrl;
    exports.unfunc = unfunc;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-uploadx.umd.js.map
