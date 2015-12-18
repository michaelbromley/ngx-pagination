import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";
import {PaginatePipe, PaginationControlsCmp, IPaginationInstance} from '../src/ng2-pagination';
import {StringFilterPipe} from "./string-filter-pipe";

@Component({
    selector: 'advanced-example',
    templateUrl: 'demo/advanced-example-cmp.html',
    directives: [PaginationControlsCmp],
    pipes: [PaginatePipe, StringFilterPipe],
    providers: [CORE_DIRECTIVES]
})
export class AdvancedExampleCmp {

    @Input('data') meals: string[] = [];

    public filter: string = '';
    public maxSize: number = 7;
    public directionLinks: boolean = true;
    public autoHide: boolean = false;
    public config: IPaginationInstance = {
        id: 'advanced',
        itemsPerPage: 10,
        currentPage: 1
    };

}