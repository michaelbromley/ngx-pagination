import {ChangeDetectionStrategy, Component, Input} from "@angular/core"
import {PaginatePipe, PaginationControlsCmp, IPaginationInstance} from '../../src/ng2-pagination';


@Component({
    selector: 'custom-template-example',
    template: require('./custom-template-example-cmp.html'),
    directives: [PaginationControlsCmp],
    pipes: [PaginatePipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTemplateExampleCmp {

    @Input('data') meals: string[] = [];

    public config: IPaginationInstance = {
        id: 'custom',
        itemsPerPage: 10,
        currentPage: 1
    };
}