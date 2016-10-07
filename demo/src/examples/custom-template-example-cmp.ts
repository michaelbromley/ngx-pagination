import {ChangeDetectionStrategy, Component, Input} from "@angular/core"
import {IPaginationInstance} from '../../../src/ng2-pagination';

@Component({
    selector: 'custom-template-example',
    templateUrl: './custom-template-example-cmp.html',
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