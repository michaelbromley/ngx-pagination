import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";
import {PaginatePipe, PaginationControlsCmp, IPaginationInstance} from '../../dist/ng2-pagination';


@Component({
    selector: 'basic-example',
    templateUrl: 'demo/src/basic-example-cmp.html',
    directives: [PaginationControlsCmp],
    pipes: [PaginatePipe],
    providers: [CORE_DIRECTIVES]
})
export class BasicExampleCmp {

    @Input('data') meals: string[] = [];

}