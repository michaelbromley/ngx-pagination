import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PaginatePipe} from './paginate-pipe';
import {PaginationService} from './pagination-service';
import {PaginationControlsCmp} from './pagination-controls-cmp';
export {IPaginationInstance} from './pagination-service';

@NgModule({
    imports: [CommonModule],
    declarations: [
        PaginatePipe,
        PaginationControlsCmp
    ],
    providers: [PaginationService],
    exports: [PaginatePipe, PaginationControlsCmp]
})
export class Ng2PaginationModule { }
