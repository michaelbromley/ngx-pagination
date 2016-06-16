import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {PaginatePipe, PaginationControlsCmp, IPaginationInstance} from '../../src/ng2-pagination';
import {StringFilterPipe} from "./string-filter-pipe";

@Component({
    selector: 'advanced-example',
    template: require('./advanced-example-cmp.html'),
    directives: [PaginationControlsCmp],
    pipes: [PaginatePipe, StringFilterPipe],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvancedExampleCmp {
 
    @Input('data') meals: string[] = [];

    public filter: string = '';
    public maxSize: number = 7;
    public directionLinks: boolean = true;
    public autoHide: boolean = false;
    public config: IPaginationInstance = {
        id: 'advanced',
        itemsPerPage: 10,
        currentPage: 1
    };

    private popped = [];

    onPageChange(number: number) {
        console.log('change to page', number);
        this.config.currentPage = number;
    }

    pushItem() {
        let item = this.popped.pop() || 'A newly-created meal!';
        this.meals.push(item);
    }

    popItem() {
        this.popped.push(this.meals.pop());
    }
}