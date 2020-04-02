import { ElementRef, EventEmitter, OnInit, Renderer2 } from '@angular/core';
import { UploadxControlEvent, UploadxOptions } from './interfaces';
import { UploadxService } from './uploadx.service';
export declare class UploadxDirective implements OnInit {
    private elementRef;
    private renderer;
    private uploadService;
    uploadxState: EventEmitter<{}>;
    uploadx: UploadxOptions;
    uploadxAction: UploadxControlEvent;
    constructor(elementRef: ElementRef, renderer: Renderer2, uploadService: UploadxService);
    ngOnInit(): void;
    fileListener(files: FileList): void;
}
