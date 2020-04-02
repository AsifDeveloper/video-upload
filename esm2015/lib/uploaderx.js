import * as tslib_1 from "tslib";
import { Uploader } from './uploader';
import { resolveUrl } from './utils';
/**
 * Implements XHR/CORS Resumable Upload
 * @see
 * https://developers.google.com/drive/api/v3/manage-uploads#resumable
 */
export class UploaderX extends Uploader {
    constructor() {
        super(...arguments);
        this.responseType = 'json';
    }
    getFileUrl() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Upload-Content-Length': this.size.toString(),
                'X-Upload-Content-Type': this.file.type || 'application/octet-stream'
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { end, body } = this.getChunk();
            const headers = {
                'Content-Type': 'application/octet-stream',
                'Content-Range': `bytes ${this.offset}-${end - 1}/${this.size}`
            };
            yield this.request({ method: 'PUT', body, headers });
            return this.getOffsetFromResponse();
        });
    }
    getOffset() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const headers = {
                'Content-Type': 'application/octet-stream',
                'Content-Range': `bytes */${this.size}`
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
export function getRangeEnd(range = '') {
    const end = +range.split(/0-/)[1];
    return end >= 0 ? end : -1;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkZXJ4LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXVwbG9hZHgvIiwic291cmNlcyI6WyJsaWIvdXBsb2FkZXJ4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFFckM7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxTQUFVLFNBQVEsUUFBUTtJQUF2Qzs7UUFDRSxpQkFBWSxHQUFHLE1BQW9DLENBQUM7SUFpRHRELENBQUM7SUFoRE8sVUFBVTs7WUFDZCxNQUFNLE9BQU8sR0FBRztnQkFDZCxjQUFjLEVBQUUsaUNBQWlDO2dCQUNqRCx5QkFBeUIsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDL0MsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksMEJBQTBCO2FBQ3RFLENBQUM7WUFDRixNQUFNLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ2pCLE1BQU0sRUFBRSxNQUFNO2dCQUNkLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7Z0JBQ25DLEdBQUcsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDbEIsT0FBTzthQUNSLENBQUMsQ0FBQztZQUNILE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQzthQUN2RDtZQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQzFELE9BQU8sVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0MsQ0FBQztLQUFBO0lBRUssZUFBZTs7WUFDbkIsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdEMsTUFBTSxPQUFPLEdBQUc7Z0JBQ2QsY0FBYyxFQUFFLDBCQUEwQjtnQkFDMUMsZUFBZSxFQUFFLFNBQVMsSUFBSSxDQUFDLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7YUFDaEUsQ0FBQztZQUNGLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDckQsT0FBTyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN0QyxDQUFDO0tBQUE7SUFFSyxTQUFTOztZQUNiLE1BQU0sT0FBTyxHQUFHO2dCQUNkLGNBQWMsRUFBRSwwQkFBMEI7Z0JBQzFDLGVBQWUsRUFBRSxXQUFXLElBQUksQ0FBQyxJQUFJLEVBQUU7YUFDeEMsQ0FBQztZQUNGLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUMvQyxPQUFPLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3RDLENBQUM7S0FBQTtJQUVTLHFCQUFxQjtRQUM3QixJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxFQUFFO1lBQzdCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNqRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1NBQ25EO1FBQ0QsSUFBSSxJQUFJLENBQUMsY0FBYyxJQUFJLEdBQUcsRUFBRTtZQUM5QixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDbEI7SUFDSCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLFVBQVUsV0FBVyxDQUFDLEtBQUssR0FBRyxFQUFFO0lBQ3BDLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxPQUFPLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVwbG9hZGVyIH0gZnJvbSAnLi91cGxvYWRlcic7XG5pbXBvcnQgeyByZXNvbHZlVXJsIH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogSW1wbGVtZW50cyBYSFIvQ09SUyBSZXN1bWFibGUgVXBsb2FkXG4gKiBAc2VlXG4gKiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9kcml2ZS9hcGkvdjMvbWFuYWdlLXVwbG9hZHMjcmVzdW1hYmxlXG4gKi9cbmV4cG9ydCBjbGFzcyBVcGxvYWRlclggZXh0ZW5kcyBVcGxvYWRlciB7XG4gIHJlc3BvbnNlVHlwZSA9ICdqc29uJyBhcyBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZTtcbiAgYXN5bmMgZ2V0RmlsZVVybCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgJ1gtVXBsb2FkLUNvbnRlbnQtTGVuZ3RoJzogdGhpcy5zaXplLnRvU3RyaW5nKCksXG4gICAgICAnWC1VcGxvYWQtQ29udGVudC1UeXBlJzogdGhpcy5maWxlLnR5cGUgfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSdcbiAgICB9O1xuICAgIGF3YWl0IHRoaXMucmVxdWVzdCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHRoaXMubWV0YWRhdGEpLFxuICAgICAgdXJsOiB0aGlzLmVuZHBvaW50LFxuICAgICAgaGVhZGVyc1xuICAgIH0pO1xuICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5nZXRWYWx1ZUZyb21SZXNwb25zZSgnbG9jYXRpb24nKTtcbiAgICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgb3IgbWlzc2luZyBMb2NhdGlvbiBoZWFkZXInKTtcbiAgICB9XG4gICAgdGhpcy5vZmZzZXQgPSB0aGlzLnJlc3BvbnNlU3RhdHVzID09PSAyMDEgPyAwIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXNvbHZlVXJsKGxvY2F0aW9uLCB0aGlzLmVuZHBvaW50KTtcbiAgfVxuXG4gIGFzeW5jIHNlbmRGaWxlQ29udGVudCgpOiBQcm9taXNlPG51bWJlciB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IHsgZW5kLCBib2R5IH0gPSB0aGlzLmdldENodW5rKCk7XG4gICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJyxcbiAgICAgICdDb250ZW50LVJhbmdlJzogYGJ5dGVzICR7dGhpcy5vZmZzZXR9LSR7ZW5kIC0gMX0vJHt0aGlzLnNpemV9YFxuICAgIH07XG4gICAgYXdhaXQgdGhpcy5yZXF1ZXN0KHsgbWV0aG9kOiAnUFVUJywgYm9keSwgaGVhZGVycyB9KTtcbiAgICByZXR1cm4gdGhpcy5nZXRPZmZzZXRGcm9tUmVzcG9uc2UoKTtcbiAgfVxuXG4gIGFzeW5jIGdldE9mZnNldCgpOiBQcm9taXNlPG51bWJlciB8IHVuZGVmaW5lZD4ge1xuICAgIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScsXG4gICAgICAnQ29udGVudC1SYW5nZSc6IGBieXRlcyAqLyR7dGhpcy5zaXplfWBcbiAgICB9O1xuICAgIGF3YWl0IHRoaXMucmVxdWVzdCh7IG1ldGhvZDogJ1BVVCcsIGhlYWRlcnMgfSk7XG4gICAgcmV0dXJuIHRoaXMuZ2V0T2Zmc2V0RnJvbVJlc3BvbnNlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0T2Zmc2V0RnJvbVJlc3BvbnNlKCk6IG51bWJlciB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMucmVzcG9uc2VTdGF0dXMgPiAyMDEpIHtcbiAgICAgIGNvbnN0IHJhbmdlID0gdGhpcy5nZXRWYWx1ZUZyb21SZXNwb25zZSgnUmFuZ2UnKTtcbiAgICAgIHJldHVybiByYW5nZSA/IGdldFJhbmdlRW5kKHJhbmdlKSArIDEgOiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGlmICh0aGlzLnJlc3BvbnNlU3RhdHVzIDw9IDIwMSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmdlRW5kKHJhbmdlID0gJycpOiBudW1iZXIge1xuICBjb25zdCBlbmQgPSArcmFuZ2Uuc3BsaXQoLzAtLylbMV07XG4gIHJldHVybiBlbmQgPj0gMCA/IGVuZCA6IC0xO1xufVxuIl19