import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";
import {PaginatePipe, PAGINATION_DIRECTIVES, IPaginationInstance} from '../../src/ng2-pagination';
import {StringFilterPipe} from "./string-filter-pipe";

@Component({
    selector: 'advanced-example',
    templateUrl: 'demo/src/advanced-example-cmp.html',
    directives: [PAGINATION_DIRECTIVES],
    pipes: [PaginatePipe, StringFilterPipe],
    providers: [CORE_DIRECTIVES]
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