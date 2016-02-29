import {Component, Input} from "angular2/core";
import {PaginatePipe, PaginationControlsCmp, IPaginationInstance} from '../../src/ng2-pagination';


@Component({
    selector: 'basic-example',
    template: require('./basic-example-cmp.html'),
    directives: [PaginationControlsCmp],
    pipes: [PaginatePipe]
})
export class BasicExampleCmp {

    @Input('data') meals: string[] = [];

}