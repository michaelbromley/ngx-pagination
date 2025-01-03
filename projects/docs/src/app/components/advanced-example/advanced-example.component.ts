import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import {PaginationInstance} from 'ngx-pagination';
import { NgxPaginationModule } from 'ngx-pagination';
import { StringFilterPipe } from '../../string-filter.pipe';

@Component({
    selector: 'advanced-example',
    templateUrl: './advanced-example.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    imports: [NgxPaginationModule, FormsModule, NgFor, StringFilterPipe]
})
export class AdvancedExampleComponent {

    @Input('data') meals: string[] = [];

    public filter: string = '';
    public maxSize: number = 7;
    public directionLinks: boolean = true;
    public autoHide: boolean = false;
    public responsive: boolean = false;
    public config: PaginationInstance = {
        id: 'advanced',
        itemsPerPage: 10,
        currentPage: 1
    };
    public labels: any = {
        previousLabel: 'Previous',
        nextLabel: 'Next',
        screenReaderPaginationLabel: 'Pagination',
        screenReaderPageLabel: 'page',
        screenReaderCurrentLabel: `You're on page`
    };
    public eventLog: string[] = [];

    private popped = [];

    onPageChange(number: number) {
        this.logEvent(`pageChange(${number})`);
        this.config.currentPage = number;
    }

    onPageBoundsCorrection(number: number) {
        this.logEvent(`pageBoundsCorrection(${number})`);
        this.config.currentPage = number;
    }

    pushItem() {
        let item = this.popped.pop() || 'A newly-created meal!';
        this.meals.push(item);
    }

    popItem() {
        this.popped.push(this.meals.pop());
    }

    private logEvent(message: string) {
        this.eventLog.unshift(`${new Date().toISOString()}: ${message}`)
    }
}
