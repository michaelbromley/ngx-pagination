import {ChangeDetectionStrategy, Component, Input} from "@angular/core";


@Component({
    selector: 'basic-example',
    templateUrl: './basic-example-cmp.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicExampleCmp {
    @Input('data') meals: string[] = [];
    page: number = 1;
}