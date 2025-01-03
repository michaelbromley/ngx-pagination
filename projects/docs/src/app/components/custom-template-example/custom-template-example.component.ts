import {ChangeDetectionStrategy, Component, Input} from "@angular/core"
import { NgxPaginationModule } from 'ngx-pagination';
import {PaginationInstance} from 'ngx-pagination';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'custom-template-example',
    templateUrl: './custom-template-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgxPaginationModule, NgFor, NgIf]
})
export class CustomTemplateExampleComponent {

    @Input('data') meals: string[] = [];

    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 10,
        currentPage: 1
    };
}
