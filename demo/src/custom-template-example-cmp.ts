import {Component, Input} from "angular2/core"
import {PaginatePipe, PAGINATION_DIRECTIVES, IPaginationInstance} from '../../src/ng2-pagination';


@Component({
    selector: 'custom-template-example',
    template: require('./custom-template-example-cmp.html'),
    directives: [PAGINATION_DIRECTIVES],
    pipes: [PaginatePipe]
})
export class CustomTemplateExampleCmp {

    @Input('data') meals: string[] = [];

    public config: IPaginationInstance = {
        id: 'custom',
        itemsPerPage: 10,
        currentPage: 1
    };
}