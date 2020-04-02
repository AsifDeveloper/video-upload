import * as tslib_1 from "tslib";
var UploadxService_1;
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UploaderX } from './uploaderx';
import { pick } from './utils';
import * as i0 from "@angular/core";
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
UploadxService.ngInjectableDef = i0.defineInjectable({ factory: function UploadxService_Factory() { return new UploadxService(i0.inject(i0.NgZone)); }, token: UploadxService, providedIn: "root" });
UploadxService = UploadxService_1 = tslib_1.__decorate([
    Injectable({ providedIn: 'root' })
], UploadxService);
export { UploadxService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkeC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXVwbG9hZHgvIiwic291cmNlcyI6WyJsaWIvdXBsb2FkeC5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxTQUFTLEVBQWMsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUNwRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR2hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFNBQVMsQ0FBQzs7QUFVL0IsSUFBYSxjQUFjLHNCQUEzQixNQUFhLGNBQWM7SUFpQ3pCLFlBQW9CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBZmxDLG1CQUFtQjtRQUNuQixVQUFLLEdBQWUsRUFBRSxDQUFDO1FBQ3ZCLFlBQU8sR0FBb0M7WUFDekMsUUFBUSxFQUFFLFNBQVM7WUFDbkIsVUFBVSxFQUFFLElBQUk7WUFDaEIsV0FBVyxFQUFFLENBQUM7WUFDZCxXQUFXLEVBQUUsQ0FBQyxHQUFhLEVBQUUsRUFBRTtnQkFDN0IsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsZ0JBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQ25GLENBQUM7WUFDSixDQUFDO1NBQ0YsQ0FBQztRQUVlLGlCQUFZLEdBQXlCLElBQUksT0FBTyxFQUFFLENBQUM7UUFDNUQsU0FBSSxHQUFtQixFQUFFLENBQUM7UUFFaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENB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Q0FBQztJQUVPLFlBQVk7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQztRQUV2RSxJQUFJLENBQUMsS0FBSzthQUNQLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUM7YUFDMUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN2RSxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0YsQ0FBQTtBQS9JUSx3QkFBUyxHQUE2QjtJQUMzQyxNQUFNO0lBQ04sTUFBTTtJQUNOLFVBQVU7SUFDVixXQUFXO0lBQ1gsVUFBVTtJQUNWLGdCQUFnQjtJQUNoQixNQUFNO0lBQ04sT0FBTztJQUNQLFFBQVE7SUFDUixVQUFVO0lBQ1YsS0FBSztDQUNOLENBQUM7O1lBb0IwQixNQUFNOzs7QUFqQ3ZCLGNBQWM7SUFEMUIsVUFBVSxDQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDO0dBQ3RCLGNBQWMsQ0FnSjFCO1NBaEpZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IG1hcCwgc3RhcnRXaXRoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgVXBsb2FkZXJPcHRpb25zLCBVcGxvYWRTdGF0ZSwgVXBsb2FkeENvbnRyb2xFdmVudCwgVXBsb2FkeE9wdGlvbnMgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgVXBsb2FkZXIgfSBmcm9tICcuL3VwbG9hZGVyJztcbmltcG9ydCB7IFVwbG9hZGVyWCB9IGZyb20gJy4vdXBsb2FkZXJ4JztcbmltcG9ydCB7IHBpY2sgfSBmcm9tICcuL3V0aWxzJztcblxuaW50ZXJmYWNlIERlZmF1bHRPcHRpb25zIHtcbiAgZW5kcG9pbnQ6IHN0cmluZztcbiAgYXV0b1VwbG9hZDogYm9vbGVhbjtcbiAgY29uY3VycmVuY3k6IG51bWJlcjtcbiAgc3RhdGVDaGFuZ2U6IChldnQ6IFVwbG9hZGVyKSA9PiB2b2lkO1xufVxuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFVwbG9hZHhTZXJ2aWNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgc3RhdGljIHN0YXRlS2V5czogQXJyYXk8a2V5b2YgVXBsb2FkU3RhdGU+ID0gW1xuICAgICdmaWxlJyxcbiAgICAnbmFtZScsXG4gICAgJ3Byb2dyZXNzJyxcbiAgICAncmVtYWluaW5nJyxcbiAgICAncmVzcG9uc2UnLFxuICAgICdyZXNwb25zZVN0YXR1cycsXG4gICAgJ3NpemUnLFxuICAgICdzcGVlZCcsXG4gICAgJ3N0YXR1cycsXG4gICAgJ3VwbG9hZElkJyxcbiAgICAndXJsJ1xuICBdO1xuICAvKiogVXBsb2FkIHN0YXR1cyBldmVudHMgKi9cbiAgZ2V0IGV2ZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHNTdHJlYW0uYXNPYnNlcnZhYmxlKCk7XG4gIH1cbiAgLyoqIFVwbG9hZCBRdWV1ZSAqL1xuICBxdWV1ZTogVXBsb2FkZXJbXSA9IFtdO1xuICBvcHRpb25zOiBVcGxvYWR4T3B0aW9ucyAmIERlZmF1bHRPcHRpb25zID0ge1xuICAgIGVuZHBvaW50OiAnL3VwbG9hZCcsXG4gICAgYXV0b1VwbG9hZDogdHJ1ZSxcbiAgICBjb25jdXJyZW5jeTogMixcbiAgICBzdGF0ZUNoYW5nZTogKGV2dDogVXBsb2FkZXIpID0+IHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT5cbiAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHRoaXMuZXZlbnRzU3RyZWFtLm5leHQocGljayhldnQsIFVwbG9hZHhTZXJ2aWNlLnN0YXRlS2V5cykpKVxuICAgICAgKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSByZWFkb25seSBldmVudHNTdHJlYW06IFN1YmplY3Q8VXBsb2FkU3RhdGU+ID0gbmV3IFN1YmplY3QoKTtcbiAgcHJpdmF0ZSBzdWJzOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5nWm9uZTogTmdab25lKSB7XG4gICAgdGhpcy5zdWJzLnB1c2goXG4gICAgICBmcm9tRXZlbnQod2luZG93LCAnb25saW5lJykuc3Vic2NyaWJlKCgpID0+IHRoaXMuY29udHJvbCh7IGFjdGlvbjogJ3VwbG9hZCcgfSkpLFxuICAgICAgZnJvbUV2ZW50KHdpbmRvdywgJ29mZmxpbmUnKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jb250cm9sKHsgYWN0aW9uOiAncGF1c2UnIH0pKSxcbiAgICAgIHRoaXMuZXZlbnRzLnN1YnNjcmliZSgoeyBzdGF0dXMgfSkgPT4ge1xuICAgICAgICBpZiAoc3RhdHVzICE9PSAndXBsb2FkaW5nJyAmJiBzdGF0dXMgIT09ICdhZGRlZCcpIHtcbiAgICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLnByb2Nlc3NRdWV1ZSgpKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHNlcnZpY2VcbiAgICogQHBhcmFtIG9wdGlvbnMgZ2xvYmFsIG1vZHVsZSBvcHRpb25zXG4gICAqIEByZXR1cm5zIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIG5ldyB2YWx1ZSBvbiBwcm9ncmVzcyBvciBzdGF0dXMgY2hhbmdlc1xuICAgKi9cbiAgaW5pdChvcHRpb25zOiBVcGxvYWR4T3B0aW9ucyA9IHt9KTogT2JzZXJ2YWJsZTxVcGxvYWRTdGF0ZT4ge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5vcHRpb25zLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5ldmVudHM7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZXMgc2VydmljZVxuICAgKiBAcGFyYW0gb3B0aW9ucyBnbG9iYWwgbW9kdWxlIG9wdGlvbnNcbiAgICogQHJldHVybnMgT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBjdXJyZW50IGFycmF5IG9mIHVwbG9hZGVyc1xuICAgKi9cbiAgY29ubmVjdChvcHRpb25zPzogVXBsb2FkeE9wdGlvbnMpOiBPYnNlcnZhYmxlPFVwbG9hZGVyW10+IHtcbiAgICByZXR1cm4gdGhpcy5pbml0KG9wdGlvbnMpLnBpcGUoXG4gICAgICBzdGFydFdpdGgoMCksXG4gICAgICBtYXAoKCkgPT4gdGhpcy5xdWV1ZSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlcm1pbmF0ZXMgYWxsIHVwbG9hZHMgYW5kIGNsZWFycyB0aGUgcXVldWVcbiAgICovXG4gIGRpc2Nvbm5lY3QoKTogdm9pZCB7XG4gICAgdGhpcy5xdWV1ZS5mb3JFYWNoKHVwbG9hZGVyID0+ICh1cGxvYWRlci5zdGF0dXMgPSAncGF1c2VkJykpO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgIHRoaXMuc3Vicy5mb3JFYWNoKHN1YiA9PiBzdWIudW5zdWJzY3JpYmUoKSk7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZSBVcGxvYWRlciBhbmQgYWRkIHRvIHRoZSBxdWV1ZVxuICAgKi9cbiAgaGFuZGxlRmlsZUxpc3QoZmlsZUxpc3Q6IEZpbGVMaXN0LCBvcHRpb25zID0ge30gYXMgVXBsb2FkeE9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBpbnN0YW5jZU9wdGlvbnMgPSB7IC4uLnRoaXMub3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuICAgIHRoaXMub3B0aW9ucy5jb25jdXJyZW5jeSA9IGluc3RhbmNlT3B0aW9ucy5jb25jdXJyZW5jeTtcbiAgICBBcnJheS5mcm9tKGZpbGVMaXN0KS5mb3JFYWNoKGZpbGUgPT4gdGhpcy5hZGRVcGxvYWRlckluc3RhbmNlKGZpbGUsIGluc3RhbmNlT3B0aW9ucykpO1xuICAgIHRoaXMuYXV0b1VwbG9hZEZpbGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIFVwbG9hZGVyIGZvciB0aGUgZmlsZSBhbmQgYWRkIHRvIHRoZSBxdWV1ZVxuICAgKi9cbiAgaGFuZGxlRmlsZShmaWxlOiBGaWxlLCBvcHRpb25zID0ge30gYXMgVXBsb2FkeE9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCBpbnN0YW5jZU9wdGlvbnMgPSB7IC4uLnRoaXMub3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuICAgIHRoaXMuYWRkVXBsb2FkZXJJbnN0YW5jZShmaWxlLCBpbnN0YW5jZU9wdGlvbnMpO1xuICAgIHRoaXMuYXV0b1VwbG9hZEZpbGVzKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBsb2FkIGNvbnRyb2xcbiAgICogQGV4YW1wbGVcbiAgICogLy8gcGF1c2UgYWxsXG4gICAqIHRoaXMudXBsb2FkU2VydmljZS5jb250cm9sKHsgYWN0aW9uOiAncGF1c2UnIH0pO1xuICAgKiAvLyBwYXVzZSB1cGxvYWQgd2l0aCB1cGxvYWRJZFxuICAgKiB0aGlzLnVwbG9hZFNlcnZpY2UuY29udHJvbCh7IGFjdGlvbjogJ3BhdXNlJywgdXBsb2FkSWR9KTtcbiAgICogLy8gc2V0IHRva2VuXG4gICAqIHRoaXMudXBsb2FkU2VydmljZS5jb250cm9sKHsgdG9rZW46IGBUT0tFTmAgfSk7XG4gICAqL1xuICBjb250cm9sKGV2dDogVXBsb2FkeENvbnRyb2xFdmVudCk6IHZvaWQge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2dC51cGxvYWRJZFxuICAgICAgPyB0aGlzLnF1ZXVlLmZpbHRlcigoeyB1cGxvYWRJZCB9KSA9PiB1cGxvYWRJZCA9PT0gZXZ0LnVwbG9hZElkKVxuICAgICAgOiB0aGlzLnF1ZXVlO1xuICAgIHRhcmdldC5mb3JFYWNoKHVwbG9hZGVyID0+IHVwbG9hZGVyLmNvbmZpZ3VyZShldnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIG51bWJlciBvZiBhY3RpdmUgdXBsb2Fkc1xuICAgKi9cbiAgcnVubmluZ1Byb2Nlc3MoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5xdWV1ZS5maWx0ZXIoKHsgc3RhdHVzIH0pID0+IHN0YXR1cyA9PT0gJ3VwbG9hZGluZycgfHwgc3RhdHVzID09PSAncmV0cnknKS5sZW5ndGg7XG4gIH1cblxuICBwcml2YXRlIGFkZFVwbG9hZGVySW5zdGFuY2UoZmlsZTogRmlsZSwgb3B0aW9uczogVXBsb2FkeE9wdGlvbnMpOiB2b2lkIHtcbiAgICBjb25zdCB1cGxvYWRlciA9IG5ldyAob3B0aW9ucy51cGxvYWRlckNsYXNzIHx8IFVwbG9hZGVyWCkoZmlsZSwgb3B0aW9ucyBhcyBVcGxvYWRlck9wdGlvbnMpO1xuICAgIHRoaXMucXVldWUucHVzaCh1cGxvYWRlcik7XG4gICAgdXBsb2FkZXIuc3RhdHVzID0gJ2FkZGVkJztcbiAgfVxuXG4gIHByaXZhdGUgYXV0b1VwbG9hZEZpbGVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b1VwbG9hZCAmJiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZSkge1xuICAgICAgdGhpcy5xdWV1ZVxuICAgICAgICAuZmlsdGVyKCh7IHN0YXR1cyB9KSA9PiBzdGF0dXMgPT09ICdhZGRlZCcpXG4gICAgICAgIC5mb3JFYWNoKHVwbG9hZGVyID0+ICh1cGxvYWRlci5zdGF0dXMgPSAncXVldWUnKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzUXVldWUoKTogdm9pZCB7XG4gICAgdGhpcy5xdWV1ZSA9IHRoaXMucXVldWUuZmlsdGVyKCh7IHN0YXR1cyB9KSA9PiBzdGF0dXMgIT09ICdjYW5jZWxsZWQnKTtcblxuICAgIHRoaXMucXVldWVcbiAgICAgIC5maWx0ZXIoKHsgc3RhdHVzIH0pID0+IHN0YXR1cyA9PT0gJ3F1ZXVlJylcbiAgICAgIC5zbGljZSgwLCBNYXRoLm1heCh0aGlzLm9wdGlvbnMuY29uY3VycmVuY3kgLSB0aGlzLnJ1bm5pbmdQcm9jZXNzKCksIDApKVxuICAgICAgLmZvckVhY2godXBsb2FkZXIgPT4gdXBsb2FkZXIudXBsb2FkKCkpO1xuICB9XG59XG4iXX0=