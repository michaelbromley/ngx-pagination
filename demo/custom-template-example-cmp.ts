import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";
import {PaginatePipe, PaginationControlsCmp, IPaginationInstance} from '../src/ng2-pagination';


@Component({
    selector: 'custom-template-example',
    templateUrl: 'demo/custom-template-example-cmp.html',
    directives: [PaginationControlsCmp],
    pipes: [PaginatePipe],
    providers: [CORE_DIRECTIVES]
})
export class CustomTemplateExampleCmp {

    @Input('data') meals: string[] = [];

}