import {ChangeDetectionStrategy, Component, Input} from "@angular/core";


@Component({
    selector: 'basic-example',
    templateUrl: './basic-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicExampleComponent {
    @Input('data') meals: string[] = [];
    page: number = 1;
}