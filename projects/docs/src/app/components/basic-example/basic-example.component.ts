import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import { NgxPaginationModule } from 'ngx-pagination';
import { NgFor } from '@angular/common';

@Component({
    selector: 'basic-example',
    templateUrl: './basic-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgxPaginationModule, NgFor]
})
export class BasicExampleComponent {
    @Input('data') meals: string[] = [];
    page: number = 1;
}
