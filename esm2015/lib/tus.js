import * as tslib_1 from "tslib";
import { Uploader } from './uploader';
import { b64, resolveUrl } from './utils';
/**
 * Implements tus resumable upload protocol
 * @see
 * https://github.com/tus/tus-resumable-upload-protocol/blob/master/protocol.md
 */
export class Tus extends Uploader {
    constructor() {
        super(...arguments);
        this.headers = { 'Tus-Resumable': '1.0.0' };
    }
    getFileUrl() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.request({ method: 'HEAD' });
            return this.getOffsetFromResponse();
        });
    }
    getOffsetFromResponse() {
        const offsetStr = this.getValueFromResponse('Upload-Offset');
        return offsetStr ? parseInt(offsetStr, 10) : undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHVzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXVwbG9hZHgvIiwic291cmNlcyI6WyJsaWIvdHVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRTFDOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sR0FBSSxTQUFRLFFBQVE7SUFBakM7O1FBQ0UsWUFBTyxHQUFHLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBb0N6QyxDQUFDO0lBbENPLFVBQVU7O1lBQ2QsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckQsTUFBTSxPQUFPLEdBQUc7Z0JBQ2QsZUFBZSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDL0IsaUJBQWlCLEVBQUUsR0FBRyxlQUFlLEVBQUU7YUFDeEMsQ0FBQztZQUNGLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNwRSxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDYixNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7YUFDdkQ7WUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUMxRCxPQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLENBQUM7S0FBQTtJQUVLLGVBQWU7O1lBQ25CLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakMsTUFBTSxPQUFPLEdBQUc7Z0JBQ2QsY0FBYyxFQUFFLGlDQUFpQztnQkFDakQsZUFBZSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTthQUNsQyxDQUFDO1lBQ0YsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUN2RCxPQUFPLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3RDLENBQUM7S0FBQTtJQUVLLFNBQVM7O1lBQ2IsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDdkMsT0FBTyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN0QyxDQUFDO0tBQUE7SUFFUyxxQkFBcUI7UUFDN0IsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzdELE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDekQsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVXBsb2FkZXIgfSBmcm9tICcuL3VwbG9hZGVyJztcbmltcG9ydCB7IGI2NCwgcmVzb2x2ZVVybCB9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIEltcGxlbWVudHMgdHVzIHJlc3VtYWJsZSB1cGxvYWQgcHJvdG9jb2xcbiAqIEBzZWVcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS90dXMvdHVzLXJlc3VtYWJsZS11cGxvYWQtcHJvdG9jb2wvYmxvYi9tYXN0ZXIvcHJvdG9jb2wubWRcbiAqL1xuZXhwb3J0IGNsYXNzIFR1cyBleHRlbmRzIFVwbG9hZGVyIHtcbiAgaGVhZGVycyA9IHsgJ1R1cy1SZXN1bWFibGUnOiAnMS4wLjAnIH07XG5cbiAgYXN5bmMgZ2V0RmlsZVVybCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IGVuY29kZWRNZXRhRGF0YSA9IGI2NC5zZXJpYWxpemUodGhpcy5tZXRhZGF0YSk7XG4gICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICdVcGxvYWQtTGVuZ3RoJzogYCR7dGhpcy5zaXplfWAsXG4gICAgICAnVXBsb2FkLU1ldGFkYXRhJzogYCR7ZW5jb2RlZE1ldGFEYXRhfWBcbiAgICB9O1xuICAgIGF3YWl0IHRoaXMucmVxdWVzdCh7IG1ldGhvZDogJ1BPU1QnLCB1cmw6IHRoaXMuZW5kcG9pbnQsIGhlYWRlcnMgfSk7XG4gICAgY29uc3QgbG9jYXRpb24gPSB0aGlzLmdldFZhbHVlRnJvbVJlc3BvbnNlKCdsb2NhdGlvbicpO1xuICAgIGlmICghbG9jYXRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBvciBtaXNzaW5nIExvY2F0aW9uIGhlYWRlcicpO1xuICAgIH1cbiAgICB0aGlzLm9mZnNldCA9IHRoaXMucmVzcG9uc2VTdGF0dXMgPT09IDIwMSA/IDAgOiB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc29sdmVVcmwobG9jYXRpb24sIHRoaXMuZW5kcG9pbnQpO1xuICB9XG5cbiAgYXN5bmMgc2VuZEZpbGVDb250ZW50KCk6IFByb21pc2U8bnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgeyBib2R5IH0gPSB0aGlzLmdldENodW5rKCk7XG4gICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vb2Zmc2V0K29jdGV0LXN0cmVhbScsXG4gICAgICAnVXBsb2FkLU9mZnNldCc6IGAke3RoaXMub2Zmc2V0fWBcbiAgICB9O1xuICAgIGF3YWl0IHRoaXMucmVxdWVzdCh7IG1ldGhvZDogJ1BBVENIJywgYm9keSwgaGVhZGVycyB9KTtcbiAgICByZXR1cm4gdGhpcy5nZXRPZmZzZXRGcm9tUmVzcG9uc2UoKTtcbiAgfVxuXG4gIGFzeW5jIGdldE9mZnNldCgpOiBQcm9taXNlPG51bWJlciB8IHVuZGVmaW5lZD4ge1xuICAgIGF3YWl0IHRoaXMucmVxdWVzdCh7IG1ldGhvZDogJ0hFQUQnIH0pO1xuICAgIHJldHVybiB0aGlzLmdldE9mZnNldEZyb21SZXNwb25zZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldE9mZnNldEZyb21SZXNwb25zZSgpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IG9mZnNldFN0ciA9IHRoaXMuZ2V0VmFsdWVGcm9tUmVzcG9uc2UoJ1VwbG9hZC1PZmZzZXQnKTtcbiAgICByZXR1cm4gb2Zmc2V0U3RyID8gcGFyc2VJbnQob2Zmc2V0U3RyLCAxMCkgOiB1bmRlZmluZWQ7XG4gIH1cbn1cbiJdfQ==