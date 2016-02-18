import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";
import {PaginatePipe, PAGINATION_DIRECTIVES, IPaginationInstance} from '../../src/ng2-pagination';


@Component({
    selector: 'basic-example',
    templateUrl: 'demo/src/basic-example-cmp.html',
    directives: [PAGINATION_DIRECTIVES],
    pipes: [PaginatePipe],
    providers: [CORE_DIRECTIVES]
})
export class BasicExampleCmp {

    @Input('data') meals: string[] = [];

}