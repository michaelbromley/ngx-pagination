import {Component, Input} from "angular2/core";
import {PaginatePipe, PAGINATION_DIRECTIVES, IPaginationInstance} from '../../src/ng2-pagination';


@Component({
    selector: 'basic-example',
    template: require('./basic-example-cmp.html'),
    directives: [PAGINATION_DIRECTIVES],
    pipes: [PaginatePipe]
})
export class BasicExampleCmp {

    @Input('data') meals: string[] = [];

}