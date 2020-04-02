import { ErrorHandler } from './error-handler';
import { UploaderOptions, UploadState, UploadStatus, UploadxControlEvent } from './interfaces';
interface RequestParams {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    body?: BodyInit | null;
    url?: string;
    headers?: Record<string, string>;
    progress?: boolean;
}
/**
 * Uploader Base Class
 */
export declare abstract class Uploader implements UploadState {
    readonly file: File;
    readonly options: UploaderOptions;
    status: UploadStatus;
    url: string;
    readonly name: string;
    readonly size: number;
    readonly uploadId: string;
    response: any;
    responseStatus: number;
    progress: number;
    remaining: number;
    speed: number;
    type: string;
    /** Custom headers */
    headers: Record<string, any>;
    /** Metadata Object */
    metadata: Record<string, any>;
    /** Upload endpoint */
    endpoint: string;
    /** Chunk size in bytes */
    chunkSize: number;
    /** Auth token/tokenGetter */
    token: UploadxControlEvent['token'];
    /** Retries handler */
    protected errorHandler: ErrorHandler;
    /** Active HttpRequest */
    protected _xhr: XMLHttpRequest;
    /** byte offset within the whole file */
    protected offset?: number;
    /** Set HttpRequest responseType */
    protected responseType: XMLHttpRequestResponseType;
    private _url;
    private _status;
    private startTime;
    private stateChange;
    constructor(file: File, options: UploaderOptions);
    /**
     * Configure uploader
     */
    configure({ metadata, headers, token, endpoint, action }: UploadxControlEvent): void;
    /**
     * Starts uploading
     */
    upload(): Promise<void>;
    /**
     * Starts chunk upload
     */
    start(): Promise<void>;
    /**
     * Performs http requests
     */
    request({ method, body, url, headers, progress }: RequestParams): Promise<ProgressEvent>;
    /**
     * Get file URI
     */
    protected abstract getFileUrl(): Promise<string>;
    /**
     * Send file content and return an offset for the next request
     */
    protected abstract sendFileContent(): Promise<number | undefined>;
    /**
     * Get an offset for the next request
     */
    protected abstract getOffset(): Promise<number | undefined>;
    protected setAuth(token: string): void;
    protected abort(): void;
    protected onCancel(): void;
    /**
     * Gets the value from the response
     */
    protected getValueFromResponse(key: string): string | null;
    /**
     * Set auth token
     */
    protected getToken(): Promise<any>;
    protected getChunk(): {
        start: number;
        end: number;
        body: Blob;
    };
    private cleanup;
    private getResponseBody;
    private onProgress;
}
export {};
