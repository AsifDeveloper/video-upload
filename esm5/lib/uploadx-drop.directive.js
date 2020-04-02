import * as tslib_1 from "tslib";
import { ContentChild, Directive, HostBinding, HostListener } from '@angular/core';
import { UploadxDirective } from './uploadx.directive';
import { UploadxService } from './uploadx.service';
var UploadxDropDirective = /** @class */ (function () {
    function UploadxDropDirective(uploadService) {
        this.uploadService = uploadService;
        this.active = false;
    }
    UploadxDropDirective.prototype.dropHandler = function (event) {
        if (event.dataTransfer && event.dataTransfer.files) {
            event.stopPropagation();
            event.preventDefault();
            this.active = false;
            if (event.dataTransfer.files.item(0)) {
                this.uploadService.handleFileList(event.dataTransfer.files, this.fileInput.uploadx);
            }
        }
    };
    UploadxDropDirective.prototype.onDragOver = function (event) {
        if (event.dataTransfer && event.dataTransfer.files) {
            event.dataTransfer.dropEffect = 'copy';
            event.stopPropagation();
            event.preventDefault();
            this.active = true;
        }
    };
    UploadxDropDirective.prototype.onDragLeave = function (event) {
        this.active = false;
    };
    UploadxDropDirective.ctorParameters = function () { return [
        { type: UploadxService }
    ]; };
    tslib_1.__decorate([
        HostBinding('class.uploadx-drop-active')
    ], UploadxDropDirective.prototype, "active", void 0);
    tslib_1.__decorate([
        ContentChild(UploadxDirective)
    ], UploadxDropDirective.prototype, "fileInput", void 0);
    tslib_1.__decorate([
        HostListener('drop', ['$event'])
    ], UploadxDropDirective.prototype, "dropHandler", null);
    tslib_1.__decorate([
        HostListener('dragover', ['$event'])
    ], UploadxDropDirective.prototype, "onDragOver", null);
    tslib_1.__decorate([
        HostListener('dragleave', ['$event'])
    ], UploadxDropDirective.prototype, "onDragLeave", null);
    UploadxDropDirective = tslib_1.__decorate([
        Directive({ selector: '[uploadxDrop]' })
    ], UploadxDropDirective);
    return UploadxDropDirective;
}());
export { UploadxDropDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkeC1kcm9wLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC11cGxvYWR4LyIsInNvdXJjZXMiOlsibGliL3VwbG9hZHgtZHJvcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR25EO0lBTUUsOEJBQW9CLGFBQTZCO1FBQTdCLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtRQUpqRCxXQUFNLEdBQUcsS0FBSyxDQUFDO0lBSXFDLENBQUM7SUFHckQsMENBQVcsR0FBWCxVQUFZLEtBQWdCO1FBQzFCLElBQUksS0FBSyxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtZQUNsRCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3JGO1NBQ0Y7SUFDSCxDQUFDO0lBR0QseUNBQVUsR0FBVixVQUFXLEtBQWdCO1FBQ3pCLElBQUksS0FBSyxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtZQUNsRCxLQUFLLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7WUFDdkMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjtJQUNILENBQUM7SUFHRCwwQ0FBVyxHQUFYLFVBQVksS0FBZ0I7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQzs7Z0JBM0JrQyxjQUFjOztJQUpqRDtRQURDLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQzt3REFDMUI7SUFHZjtRQURDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQzsyREFDSDtJQUk1QjtRQURDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzsyREFVaEM7SUFHRDtRQURDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzswREFRcEM7SUFHRDtRQURDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzsyREFHckM7SUFqQ1Usb0JBQW9CO1FBRGhDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsQ0FBQztPQUM1QixvQkFBb0IsQ0FrQ2hDO0lBQUQsMkJBQUM7Q0FBQSxBQWxDRCxJQWtDQztTQWxDWSxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250ZW50Q2hpbGQsIERpcmVjdGl2ZSwgSG9zdEJpbmRpbmcsIEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVXBsb2FkeERpcmVjdGl2ZSB9IGZyb20gJy4vdXBsb2FkeC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgVXBsb2FkeFNlcnZpY2UgfSBmcm9tICcuL3VwbG9hZHguc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoeyBzZWxlY3RvcjogJ1t1cGxvYWR4RHJvcF0nIH0pXG5leHBvcnQgY2xhc3MgVXBsb2FkeERyb3BEaXJlY3RpdmUge1xuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnVwbG9hZHgtZHJvcC1hY3RpdmUnKVxuICBhY3RpdmUgPSBmYWxzZTtcblxuICBAQ29udGVudENoaWxkKFVwbG9hZHhEaXJlY3RpdmUpXG4gIGZpbGVJbnB1dDogVXBsb2FkeERpcmVjdGl2ZTtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB1cGxvYWRTZXJ2aWNlOiBVcGxvYWR4U2VydmljZSkge31cblxuICBASG9zdExpc3RlbmVyKCdkcm9wJywgWyckZXZlbnQnXSlcbiAgZHJvcEhhbmRsZXIoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIgJiYgZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzKSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgaWYgKGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcy5pdGVtKDApKSB7XG4gICAgICAgIHRoaXMudXBsb2FkU2VydmljZS5oYW5kbGVGaWxlTGlzdChldmVudC5kYXRhVHJhbnNmZXIuZmlsZXMsIHRoaXMuZmlsZUlucHV0LnVwbG9hZHgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdvdmVyJywgWyckZXZlbnQnXSlcbiAgb25EcmFnT3ZlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmRhdGFUcmFuc2ZlciAmJiBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXMpIHtcbiAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5kcm9wRWZmZWN0ID0gJ2NvcHknO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIFsnJGV2ZW50J10pXG4gIG9uRHJhZ0xlYXZlKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICB9XG59XG4iXX0=