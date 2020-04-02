import { NgZone, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadState, UploadxControlEvent, UploadxOptions } from './interfaces';
import { Uploader } from './uploader';
interface DefaultOptions {
    endpoint: string;
    autoUpload: boolean;
    concurrency: number;
    stateChange: (evt: Uploader) => void;
}
export declare class UploadxService implements OnDestroy {
    private ngZone;
    static stateKeys: Array<keyof UploadState>;
    /** Upload status events */
    readonly events: Observable<UploadState>;
    /** Upload Queue */
    queue: Uploader[];
    options: UploadxOptions & DefaultOptions;
    private readonly eventsStream;
    private subs;
    constructor(ngZone: NgZone);
    /**
     * Initializes service
     * @param options global module options
     * @returns Observable that emits a new value on progress or status changes
     */
    init(options?: UploadxOptions): Observable<UploadState>;
    /**
     * Initializes service
     * @param options global module options
     * @returns Observable that emits the current array of uploaders
     */
    connect(options?: UploadxOptions): Observable<Uploader[]>;
    /**
     * Terminates all uploads and clears the queue
     */
    disconnect(): void;
    ngOnDestroy(): void;
    /**
     * Create Uploader and add to the queue
     */
    handleFileList(fileList: FileList, options?: UploadxOptions): void;
    /**
     * Create Uploader for the file and add to the queue
     */
    handleFile(file: File, options?: UploadxOptions): void;
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
    control(evt: UploadxControlEvent): void;
    /**
     * Returns number of active uploads
     */
    runningProcess(): number;
    private addUploaderInstance;
    private autoUploadFiles;
    private processQueue;
}
export {};
