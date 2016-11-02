import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginatePipe} from './paginate.pipe';
import {PaginationService} from './pagination.service';
import {PaginationControlsComponent} from './pagination-controls.component';

export {PaginationService, IPaginationInstance} from './pagination.service';
export {PaginationControlsComponent} from './pagination-controls.component';
export {PaginatePipe} from './paginate.pipe';

@NgModule({
    imports: [CommonModule],
    declarations: [
        PaginatePipe,
        PaginationControlsComponent
    ],
    providers: [PaginationService],
    exports: [PaginatePipe, PaginationControlsComponent]
})
export class Ng2PaginationModule { }
