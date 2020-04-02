import { Uploader } from './uploader';
/**
 * Implements XHR/CORS Resumable Upload
 * @see
 * https://developers.google.com/drive/api/v3/manage-uploads#resumable
 */
export declare class UploaderX extends Uploader {
    responseType: XMLHttpRequestResponseType;
    getFileUrl(): Promise<string>;
    sendFileContent(): Promise<number | undefined>;
    getOffset(): Promise<number | undefined>;
    protected getOffsetFromResponse(): number | undefined;
}
export declare function getRangeEnd(range?: string): number;
