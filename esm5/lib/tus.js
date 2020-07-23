import * as tslib_1 from "tslib";
import { Uploader } from './uploader';
import { b64, resolveUrl } from './utils';
/**
 * Implements tus resumable upload protocol
 * @see
 * https://github.com/tus/tus-resumable-upload-protocol/blob/master/protocol.md
 */
var Tus = /** @class */ (function (_super) {
    tslib_1.__extends(Tus, _super);
    function Tus() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.headers = { 'Tus-Resumable': '1.0.0' };
        return _this;
    }
    Tus.prototype.getFileUrl = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var encodedMetaData, headers, location;
            return tslib_1.__generator(this, function (_a) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var body, headers;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = this.getChunk().body;
                        headers = {
                            'Content-Type': 'application/offset+octet-stream',
                            'Upload-Offset': "" + this.offset,
                            'ngsw-bypass': 'true'
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
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
export { Tus };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHVzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXVwbG9hZHgvIiwic291cmNlcyI6WyJsaWIvdHVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRTFDOzs7O0dBSUc7QUFDSDtJQUF5QiwrQkFBUTtJQUFqQztRQUFBLHFFQXFDQztRQXBDQyxhQUFPLEdBQUcsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLENBQUM7O0lBb0N6QyxDQUFDO0lBbENPLHdCQUFVLEdBQWhCOzs7Ozs7d0JBQ1EsZUFBZSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3dCQUMvQyxPQUFPLEdBQUc7NEJBQ2QsZUFBZSxFQUFFLEtBQUcsSUFBSSxDQUFDLElBQU07NEJBQy9CLGlCQUFpQixFQUFFLEtBQUcsZUFBaUI7eUJBQ3hDLENBQUM7d0JBQ0YscUJBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxTQUFBLEVBQUUsQ0FBQyxFQUFBOzt3QkFBbkUsU0FBbUUsQ0FBQzt3QkFDOUQsUUFBUSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFDdkQsSUFBSSxDQUFDLFFBQVEsRUFBRTs0QkFDYixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7eUJBQ3ZEO3dCQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO3dCQUMxRCxzQkFBTyxVQUFVLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBQzs7OztLQUM1QztJQUVLLDZCQUFlLEdBQXJCOzs7Ozs7d0JBQ1UsSUFBSSxHQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBcEIsQ0FBcUI7d0JBQzNCLE9BQU8sR0FBRzs0QkFDZCxjQUFjLEVBQUUsaUNBQWlDOzRCQUNqRCxlQUFlLEVBQUUsS0FBRyxJQUFJLENBQUMsTUFBUTt5QkFDbEMsQ0FBQzt3QkFDRixxQkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLE1BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLEVBQUE7O3dCQUF0RCxTQUFzRCxDQUFDO3dCQUN2RCxzQkFBTyxJQUFJLENBQUMscUJBQXFCLEVBQUUsRUFBQzs7OztLQUNyQztJQUVLLHVCQUFTLEdBQWY7Ozs7NEJBQ0UscUJBQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFBOzt3QkFBdEMsU0FBc0MsQ0FBQzt3QkFDdkMsc0JBQU8sSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUM7Ozs7S0FDckM7SUFFUyxtQ0FBcUIsR0FBL0I7UUFDRSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDN0QsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUN6RCxDQUFDO0lBQ0gsVUFBQztBQUFELENBQUMsQUFyQ0QsQ0FBeUIsUUFBUSxHQXFDaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVcGxvYWRlciB9IGZyb20gJy4vdXBsb2FkZXInO1xuaW1wb3J0IHsgYjY0LCByZXNvbHZlVXJsIH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogSW1wbGVtZW50cyB0dXMgcmVzdW1hYmxlIHVwbG9hZCBwcm90b2NvbFxuICogQHNlZVxuICogaHR0cHM6Ly9naXRodWIuY29tL3R1cy90dXMtcmVzdW1hYmxlLXVwbG9hZC1wcm90b2NvbC9ibG9iL21hc3Rlci9wcm90b2NvbC5tZFxuICovXG5leHBvcnQgY2xhc3MgVHVzIGV4dGVuZHMgVXBsb2FkZXIge1xuICBoZWFkZXJzID0geyAnVHVzLVJlc3VtYWJsZSc6ICcxLjAuMCcgfTtcblxuICBhc3luYyBnZXRGaWxlVXJsKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgY29uc3QgZW5jb2RlZE1ldGFEYXRhID0gYjY0LnNlcmlhbGl6ZSh0aGlzLm1ldGFkYXRhKTtcbiAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgJ1VwbG9hZC1MZW5ndGgnOiBgJHt0aGlzLnNpemV9YCxcbiAgICAgICdVcGxvYWQtTWV0YWRhdGEnOiBgJHtlbmNvZGVkTWV0YURhdGF9YFxuICAgIH07XG4gICAgYXdhaXQgdGhpcy5yZXF1ZXN0KHsgbWV0aG9kOiAnUE9TVCcsIHVybDogdGhpcy5lbmRwb2ludCwgaGVhZGVycyB9KTtcbiAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMuZ2V0VmFsdWVGcm9tUmVzcG9uc2UoJ2xvY2F0aW9uJyk7XG4gICAgaWYgKCFsb2NhdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG9yIG1pc3NpbmcgTG9jYXRpb24gaGVhZGVyJyk7XG4gICAgfVxuICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5yZXNwb25zZVN0YXR1cyA9PT0gMjAxID8gMCA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzb2x2ZVVybChsb2NhdGlvbiwgdGhpcy5lbmRwb2ludCk7XG4gIH1cblxuICBhc3luYyBzZW5kRmlsZUNvbnRlbnQoKTogUHJvbWlzZTxudW1iZXIgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCB7IGJvZHkgfSA9IHRoaXMuZ2V0Q2h1bmsoKTtcbiAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9vZmZzZXQrb2N0ZXQtc3RyZWFtJyxcbiAgICAgICdVcGxvYWQtT2Zmc2V0JzogYCR7dGhpcy5vZmZzZXR9YFxuICAgIH07XG4gICAgYXdhaXQgdGhpcy5yZXF1ZXN0KHsgbWV0aG9kOiAnUEFUQ0gnLCBib2R5LCBoZWFkZXJzIH0pO1xuICAgIHJldHVybiB0aGlzLmdldE9mZnNldEZyb21SZXNwb25zZSgpO1xuICB9XG5cbiAgYXN5bmMgZ2V0T2Zmc2V0KCk6IFByb21pc2U8bnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gICAgYXdhaXQgdGhpcy5yZXF1ZXN0KHsgbWV0aG9kOiAnSEVBRCcgfSk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0T2Zmc2V0RnJvbVJlc3BvbnNlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0T2Zmc2V0RnJvbVJlc3BvbnNlKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3Qgb2Zmc2V0U3RyID0gdGhpcy5nZXRWYWx1ZUZyb21SZXNwb25zZSgnVXBsb2FkLU9mZnNldCcpO1xuICAgIHJldHVybiBvZmZzZXRTdHIgPyBwYXJzZUludChvZmZzZXRTdHIsIDEwKSA6IHVuZGVmaW5lZDtcbiAgfVxufVxuIl19