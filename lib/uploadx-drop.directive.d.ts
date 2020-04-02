import { UploadxDirective } from './uploadx.directive';
import { UploadxService } from './uploadx.service';
export declare class UploadxDropDirective {
    private uploadService;
    active: boolean;
    fileInput: UploadxDirective;
    constructor(uploadService: UploadxService);
    dropHandler(event: DragEvent): void;
    onDragOver(event: DragEvent): void;
    onDragLeave(event: DragEvent): void;
}
