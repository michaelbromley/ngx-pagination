import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";
import {PaginatePipe, PAGINATION_DIRECTIVES, IPaginationInstance} from '../../src/ng2-pagination';


@Component({
    selector: 'custom-template-example',
    templateUrl: 'demo/src/custom-template-example-cmp.html',
    directives: [PAGINATION_DIRECTIVES],
    pipes: [PaginatePipe],
    providers: [CORE_DIRECTIVES]
})
export class CustomTemplateExampleCmp {

    @Input('data') meals: string[] = [];

    public config: IPaginationInstance = {
        id: 'custom',
        itemsPerPage: 10,
        currentPage: 1
    };
}