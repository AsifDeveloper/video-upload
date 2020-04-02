import * as tslib_1 from "tslib";
import { ContentChild, Directive, HostBinding, HostListener } from '@angular/core';
import { UploadxDirective } from './uploadx.directive';
import { UploadxService } from './uploadx.service';
let UploadxDropDirective = class UploadxDropDirective {
    constructor(uploadService) {
        this.uploadService = uploadService;
        this.active = false;
    }
    dropHandler(event) {
        if (event.dataTransfer && event.dataTransfer.files) {
            event.stopPropagation();
            event.preventDefault();
            this.active = false;
            if (event.dataTransfer.files.item(0)) {
                this.uploadService.handleFileList(event.dataTransfer.files, this.fileInput.uploadx);
            }
        }
    }
    onDragOver(event) {
        if (event.dataTransfer && event.dataTransfer.files) {
            event.dataTransfer.dropEffect = 'copy';
            event.stopPropagation();
            event.preventDefault();
            this.active = true;
        }
    }
    onDragLeave(event) {
        this.active = false;
    }
};
UploadxDropDirective.ctorParameters = () => [
    { type: UploadxService }
];
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
export { UploadxDropDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkeC1kcm9wLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC11cGxvYWR4LyIsInNvdXJjZXMiOlsibGliL3VwbG9hZHgtZHJvcC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbkYsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBR25ELElBQWEsb0JBQW9CLEdBQWpDLE1BQWEsb0JBQW9CO0lBTS9CLFlBQW9CLGFBQTZCO1FBQTdCLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtRQUpqRCxXQUFNLEdBQUcsS0FBSyxDQUFDO0lBSXFDLENBQUM7SUFHckQsV0FBVyxDQUFDLEtBQWdCO1FBQzFCLElBQUksS0FBSyxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtZQUNsRCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNwQyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ3JGO1NBQ0Y7SUFDSCxDQUFDO0lBR0QsVUFBVSxDQUFDLEtBQWdCO1FBQ3pCLElBQUksS0FBSyxDQUFDLFlBQVksSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRTtZQUNsRCxLQUFLLENBQUMsWUFBWSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7WUFDdkMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjtJQUNILENBQUM7SUFHRCxXQUFXLENBQUMsS0FBZ0I7UUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztDQUNGLENBQUE7O1lBNUJvQyxjQUFjOztBQUpqRDtJQURDLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQztvREFDMUI7QUFHZjtJQURDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQzt1REFDSDtBQUk1QjtJQURDLFlBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzt1REFVaEM7QUFHRDtJQURDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztzREFRcEM7QUFHRDtJQURDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzt1REFHckM7QUFqQ1Usb0JBQW9CO0lBRGhDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFlLEVBQUUsQ0FBQztHQUM1QixvQkFBb0IsQ0FrQ2hDO1NBbENZLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRlbnRDaGlsZCwgRGlyZWN0aXZlLCBIb3N0QmluZGluZywgSG9zdExpc3RlbmVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBVcGxvYWR4RGlyZWN0aXZlIH0gZnJvbSAnLi91cGxvYWR4LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBVcGxvYWR4U2VydmljZSB9IGZyb20gJy4vdXBsb2FkeC5zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7IHNlbGVjdG9yOiAnW3VwbG9hZHhEcm9wXScgfSlcbmV4cG9ydCBjbGFzcyBVcGxvYWR4RHJvcERpcmVjdGl2ZSB7XG4gIEBIb3N0QmluZGluZygnY2xhc3MudXBsb2FkeC1kcm9wLWFjdGl2ZScpXG4gIGFjdGl2ZSA9IGZhbHNlO1xuXG4gIEBDb250ZW50Q2hpbGQoVXBsb2FkeERpcmVjdGl2ZSlcbiAgZmlsZUlucHV0OiBVcGxvYWR4RGlyZWN0aXZlO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHVwbG9hZFNlcnZpY2U6IFVwbG9hZHhTZXJ2aWNlKSB7fVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxuICBkcm9wSGFuZGxlcihldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmRhdGFUcmFuc2ZlciAmJiBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXMpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyLmZpbGVzLml0ZW0oMCkpIHtcbiAgICAgICAgdGhpcy51cGxvYWRTZXJ2aWNlLmhhbmRsZUZpbGVMaXN0KGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcywgdGhpcy5maWxlSW5wdXQudXBsb2FkeCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZHJhZ292ZXInLCBbJyRldmVudCddKVxuICBvbkRyYWdPdmVyKGV2ZW50OiBEcmFnRXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyICYmIGV2ZW50LmRhdGFUcmFuc2Zlci5maWxlcykge1xuICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLmRyb3BFZmZlY3QgPSAnY29weSc7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2xlYXZlJywgWyckZXZlbnQnXSlcbiAgb25EcmFnTGVhdmUoZXZlbnQ6IERyYWdFdmVudCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==