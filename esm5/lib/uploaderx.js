import * as tslib_1 from "tslib";
import { Uploader } from './uploader';
import { resolveUrl } from './utils';
/**
 * Implements XHR/CORS Resumable Upload
 * @see
 * https://developers.google.com/drive/api/v3/manage-uploads#resumable
 */
var UploaderX = /** @class */ (function (_super) {
    tslib_1.__extends(UploaderX, _super);
    function UploaderX() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.responseType = 'json';
        return _this;
    }
    UploaderX.prototype.getFileUrl = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var headers, location;
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, end, body, headers;
            return tslib_1.__generator(this, function (_b) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var headers;
            return tslib_1.__generator(this, function (_a) {
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
export { UploaderX };
export function getRangeEnd(range) {
    if (range === void 0) { range = ''; }
    var end = +range.split(/0-/)[1];
    return end >= 0 ? end : -1;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkZXJ4LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXVwbG9hZHgvIiwic291cmNlcyI6WyJsaWIvdXBsb2FkZXJ4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFckM7Ozs7R0FJRztBQUNIO0lBQStCLHFDQUFRO0lBQXZDO1FBQUEscUVBa0RDO1FBakRDLGtCQUFZLEdBQUcsTUFBb0MsQ0FBQzs7SUFpRHRELENBQUM7SUFoRE8sOEJBQVUsR0FBaEI7Ozs7Ozt3QkFDUSxPQUFPLEdBQUc7NEJBQ2QsY0FBYyxFQUFFLGlDQUFpQzs0QkFDakQseUJBQXlCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7NEJBQy9DLHVCQUF1QixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLDBCQUEwQjt5QkFDdEUsQ0FBQzt3QkFDRixxQkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDO2dDQUNqQixNQUFNLEVBQUUsTUFBTTtnQ0FDZCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO2dDQUNuQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVE7Z0NBQ2xCLE9BQU8sU0FBQTs2QkFDUixDQUFDLEVBQUE7O3dCQUxGLFNBS0UsQ0FBQzt3QkFDRyxRQUFRLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLENBQUMsUUFBUSxFQUFFOzRCQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQzt5QkFDdkQ7d0JBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7d0JBQzFELHNCQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFDOzs7O0tBQzVDO0lBRUssbUNBQWUsR0FBckI7Ozs7Ozt3QkFDUSxLQUFnQixJQUFJLENBQUMsUUFBUSxFQUFFLEVBQTdCLEdBQUcsU0FBQSxFQUFFLElBQUksVUFBQSxDQUFxQjt3QkFDaEMsT0FBTyxHQUFHOzRCQUNkLGNBQWMsRUFBRSwwQkFBMEI7NEJBQzFDLGVBQWUsRUFBRSxXQUFTLElBQUksQ0FBQyxNQUFNLFVBQUksR0FBRyxHQUFHLENBQUMsVUFBSSxJQUFJLENBQUMsSUFBTTt5QkFDaEUsQ0FBQzt3QkFDRixxQkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLE1BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLEVBQUE7O3dCQUFwRCxTQUFvRCxDQUFDO3dCQUNyRCxzQkFBTyxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQzs7OztLQUNyQztJQUVLLDZCQUFTLEdBQWY7Ozs7Ozt3QkFDUSxPQUFPLEdBQUc7NEJBQ2QsY0FBYyxFQUFFLDBCQUEwQjs0QkFDMUMsZUFBZSxFQUFFLGFBQVcsSUFBSSxDQUFDLElBQU07eUJBQ3hDLENBQUM7d0JBQ0YscUJBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxTQUFBLEVBQUUsQ0FBQyxFQUFBOzt3QkFBOUMsU0FBOEMsQ0FBQzt3QkFDL0Msc0JBQU8sSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUM7Ozs7S0FDckM7SUFFUyx5Q0FBcUIsR0FBL0I7UUFDRSxJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxFQUFFO1lBQzdCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1NBQ25EO1FBQ0QsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLEdBQUcsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBbERELENBQStCLFFBQVEsR0FrRHRDOztBQUVELE1BQU0sVUFBVSxXQUFXLENBQUMsS0FBVTtJQUFWLHNCQUFBLEVBQUEsVUFBVTtJQUNwQyxJQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVcGxvYWRlciB9IGZyb20gJy4vdXBsb2FkZXInO1xuaW1wb3J0IHsgcmVzb2x2ZVVybCB9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIEltcGxlbWVudHMgWEhSL0NPUlMgUmVzdW1hYmxlIFVwbG9hZFxuICogQHNlZVxuICogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vZHJpdmUvYXBpL3YzL21hbmFnZS11cGxvYWRzI3Jlc3VtYWJsZVxuICovXG5leHBvcnQgY2xhc3MgVXBsb2FkZXJYIGV4dGVuZHMgVXBsb2FkZXIge1xuICByZXNwb25zZVR5cGUgPSAnanNvbicgYXMgWE1MSHR0cFJlcXVlc3RSZXNwb25zZVR5cGU7XG4gIGFzeW5jIGdldEZpbGVVcmwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICdYLVVwbG9hZC1Db250ZW50LUxlbmd0aCc6IHRoaXMuc2l6ZS50b1N0cmluZygpLFxuICAgICAgJ1gtVXBsb2FkLUNvbnRlbnQtVHlwZSc6IHRoaXMuZmlsZS50eXBlIHx8ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nXG4gICAgfTtcbiAgICBhd2FpdCB0aGlzLnJlcXVlc3Qoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh0aGlzLm1ldGFkYXRhKSxcbiAgICAgIHVybDogdGhpcy5lbmRwb2ludCxcbiAgICAgIGhlYWRlcnNcbiAgICB9KTtcbiAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuZ2V0VmFsdWVGcm9tUmVzcG9uc2UoJ2xvY2F0aW9uJyk7XG4gICAgaWYgKCFsb2NhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG9yIG1pc3NpbmcgTG9jYXRpb24gaGVhZGVyJyk7XG4gICAgfVxuICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5yZXNwb25zZVN0YXR1cyA9PT0gMjAxID8gMCA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzb2x2ZVVybChsb2NhdGlvbiwgdGhpcy5lbmRwb2ludCk7XG4gIH1cblxuICBhc3luYyBzZW5kRmlsZUNvbnRlbnQoKTogUHJvbWlzZTxudW1iZXIgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCB7IGVuZCwgYm9keSB9ID0gdGhpcy5nZXRDaHVuaygpO1xuICAgIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScsXG4gICAgICAnQ29udGVudC1SYW5nZSc6IGBieXRlcyAke3RoaXMub2Zmc2V0fS0ke2VuZCAtIDF9LyR7dGhpcy5zaXplfWBcbiAgICB9O1xuICAgIGF3YWl0IHRoaXMucmVxdWVzdCh7IG1ldGhvZDogJ1BVVCcsIGJvZHksIGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0T2Zmc2V0RnJvbVJlc3BvbnNlKCk7XG4gIH1cblxuICBhc3luYyBnZXRPZmZzZXQoKTogUHJvbWlzZTxudW1iZXIgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nLFxuICAgICAgJ0NvbnRlbnQtUmFuZ2UnOiBgYnl0ZXMgKi8ke3RoaXMuc2l6ZX1gXG4gICAgfTtcbiAgICBhd2FpdCB0aGlzLnJlcXVlc3QoeyBtZXRob2Q6ICdQVVQnLCBoZWFkZXJzIH0pO1xuICAgIHJldHVybiB0aGlzLmdldE9mZnNldEZyb21SZXNwb25zZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldE9mZnNldEZyb21SZXNwb25zZSgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLnJlc3BvbnNlU3RhdHVzID4gMjAxKSB7XG4gICAgICBjb25zdCByYW5nZSA9IHRoaXMuZ2V0VmFsdWVGcm9tUmVzcG9uc2UoJ1JhbmdlJyk7XG4gICAgICByZXR1cm4gcmFuZ2UgPyBnZXRSYW5nZUVuZChyYW5nZSkgKyAxIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAodGhpcy5yZXNwb25zZVN0YXR1cyA8PSAyMDEpIHtcbiAgICAgIHJldHVybiB0aGlzLnNpemU7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYW5nZUVuZChyYW5nZSA9ICcnKTogbnVtYmVyIHtcbiAgY29uc3QgZW5kID0gK3JhbmdlLnNwbGl0KC8wLS8pWzFdO1xuICByZXR1cm4gZW5kID49IDAgPyBlbmQgOiAtMTtcbn1cbiJdfQ==