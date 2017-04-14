import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginatePipe} from './paginate.pipe';
import {PaginationService} from './pagination.service';
import {PaginationControlsComponent} from './pagination-controls.component';
import {PaginationControlsDirective} from './pagination-controls.directive';

export {PaginationInstance} from './pagination-instance';
export {PaginationService} from './pagination.service';
export {PaginationControlsComponent} from './pagination-controls.component';
export {PaginationControlsDirective} from './pagination-controls.directive';
export {PaginatePipe} from './paginate.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [
        PaginatePipe,
        PaginationControlsComponent,
        PaginationControlsDirective
    ],
    providers: [PaginationService],
    exports: [PaginatePipe, PaginationControlsComponent, PaginationControlsDirective]
})
export class NgxPaginationModule { }
