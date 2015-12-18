import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";
import {PaginatePipe, PaginationControlsCmp, IPaginationInstance} from '../src/ng2-pagination';
import {StringFilterPipe} from "./string-filter-pipe";


@Component({
    selector: 'basic-example',
    templateUrl: 'demo/basic-example-cmp.html',
    directives: [PaginationControlsCmp],
    pipes: [PaginatePipe, StringFilterPipe],
    providers: [CORE_DIRECTIVES]
})
export class BasicExampleCmp {

    @Input('data') meals: string[] = [];

}