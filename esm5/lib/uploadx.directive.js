import * as tslib_1 from "tslib";
import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { UploadxService } from './uploadx.service';
var UploadxDirective = /** @class */ (function () {
    function UploadxDirective(elementRef, renderer, uploadService) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.uploadService = uploadService;
        this.uploadxState = new EventEmitter();
    }
    Object.defineProperty(UploadxDirective.prototype, "uploadxAction", {
        set: function (ctrlEvent) {
            if (ctrlEvent && this.uploadService) {
                this.uploadService.control(ctrlEvent);
            }
        },
        enumerable: true,
        configurable: true
    });
    UploadxDirective.prototype.ngOnInit = function () {
        var _a = this.uploadx, multiple = _a.multiple, allowedTypes = _a.allowedTypes;
        multiple !== false && this.renderer.setAttribute(this.elementRef.nativeElement, 'multiple', '');
        allowedTypes &&
            this.renderer.setAttribute(this.elementRef.nativeElement, 'accept', allowedTypes);
        this.uploadxState.emit(this.uploadService.events);
    };
    UploadxDirective.prototype.fileListener = function (files) {
        if (files && files.item(0)) {
            this.uploadService.handleFileList(files, this.uploadx);
        }
    };
    UploadxDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: UploadxService }
    ]; };
    tslib_1.__decorate([
        Output()
    ], UploadxDirective.prototype, "uploadxState", void 0);
    tslib_1.__decorate([
        Input()
    ], UploadxDirective.prototype, "uploadx", void 0);
    tslib_1.__decorate([
        Input()
    ], UploadxDirective.prototype, "uploadxAction", null);
    tslib_1.__decorate([
        HostListener('change', ['$event.target.files'])
    ], UploadxDirective.prototype, "fileListener", null);
    UploadxDirective = tslib_1.__decorate([
        Directive({ selector: '[uploadx]' })
    ], UploadxDirective);
    return UploadxDirective;
}());
export { UploadxDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkeC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtdXBsb2FkeC8iLCJzb3VyY2VzIjpbImxpYi91cGxvYWR4LmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLE1BQU0sRUFDTixTQUFTLEVBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR25EO0lBV0UsMEJBQ1UsVUFBc0IsRUFDdEIsUUFBbUIsRUFDbkIsYUFBNkI7UUFGN0IsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtRQVp2QyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFhL0IsQ0FBQztJQVRKLHNCQUFJLDJDQUFhO2FBQWpCLFVBQWtCLFNBQThCO1lBQzlDLElBQUksU0FBUyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3ZDO1FBQ0gsQ0FBQzs7O09BQUE7SUFPRCxtQ0FBUSxHQUFSO1FBQ1EsSUFBQSxpQkFBeUMsRUFBdkMsc0JBQVEsRUFBRSw4QkFBNkIsQ0FBQztRQUVoRCxRQUFRLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVoRyxZQUFZO1lBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRXBGLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUdELHVDQUFZLEdBQVosVUFBYSxLQUFlO1FBQzFCLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7O2dCQXJCcUIsVUFBVTtnQkFDWixTQUFTO2dCQUNKLGNBQWM7O0lBWnZDO1FBREMsTUFBTSxFQUFFOzBEQUN5QjtJQUVsQztRQURDLEtBQUssRUFBRTtxREFDZ0I7SUFFeEI7UUFEQyxLQUFLLEVBQUU7eURBS1A7SUFtQkQ7UUFEQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMscUJBQXFCLENBQUMsQ0FBQzt3REFLL0M7SUFqQ1UsZ0JBQWdCO1FBRDVCLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsQ0FBQztPQUN4QixnQkFBZ0IsQ0FrQzVCO0lBQUQsdUJBQUM7Q0FBQSxBQWxDRCxJQWtDQztTQWxDWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFVwbG9hZHhDb250cm9sRXZlbnQsIFVwbG9hZHhPcHRpb25zIH0gZnJvbSAnLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IFVwbG9hZHhTZXJ2aWNlIH0gZnJvbSAnLi91cGxvYWR4LnNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbdXBsb2FkeF0nIH0pXG5leHBvcnQgY2xhc3MgVXBsb2FkeERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBPdXRwdXQoKVxuICB1cGxvYWR4U3RhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIEBJbnB1dCgpXG4gIHVwbG9hZHg6IFVwbG9hZHhPcHRpb25zO1xuICBASW5wdXQoKVxuICBzZXQgdXBsb2FkeEFjdGlvbihjdHJsRXZlbnQ6IFVwbG9hZHhDb250cm9sRXZlbnQpIHtcbiAgICBpZiAoY3RybEV2ZW50ICYmIHRoaXMudXBsb2FkU2VydmljZSkge1xuICAgICAgdGhpcy51cGxvYWRTZXJ2aWNlLmNvbnRyb2woY3RybEV2ZW50KTtcbiAgICB9XG4gIH1cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIHVwbG9hZFNlcnZpY2U6IFVwbG9hZHhTZXJ2aWNlXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCB7IG11bHRpcGxlLCBhbGxvd2VkVHlwZXMgfSA9IHRoaXMudXBsb2FkeDtcblxuICAgIG11bHRpcGxlICE9PSBmYWxzZSAmJiB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ211bHRpcGxlJywgJycpO1xuXG4gICAgYWxsb3dlZFR5cGVzICYmXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2FjY2VwdCcsIGFsbG93ZWRUeXBlcyk7XG5cbiAgICB0aGlzLnVwbG9hZHhTdGF0ZS5lbWl0KHRoaXMudXBsb2FkU2VydmljZS5ldmVudHMpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2hhbmdlJywgWyckZXZlbnQudGFyZ2V0LmZpbGVzJ10pXG4gIGZpbGVMaXN0ZW5lcihmaWxlczogRmlsZUxpc3QpIHtcbiAgICBpZiAoZmlsZXMgJiYgZmlsZXMuaXRlbSgwKSkge1xuICAgICAgdGhpcy51cGxvYWRTZXJ2aWNlLmhhbmRsZUZpbGVMaXN0KGZpbGVzLCB0aGlzLnVwbG9hZHgpO1xuICAgIH1cbiAgfVxufVxuIl19