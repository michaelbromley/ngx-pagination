import { Component } from '@angular/core';
import { MealsService } from '../../providers/meals.service';
import { HighlightModule } from 'ngx-highlightjs';
import { AdvancedExampleComponent } from './advanced-example.component';

@Component({
    selector: 'advanced-page',
    templateUrl: './advanced-page.component.html',
    imports: [AdvancedExampleComponent, HighlightModule]
})
export class AdvancedPageComponent {
    templateSource = templateSource;
    typescriptSource = typescriptSource;
    tab: string = 'html';
    meals: string[] = [];

    constructor(private mealsService: MealsService) {
        this.meals = mealsService.getMeals();
    }
}

const templateSource = `
<ul class="meal-list">
    <li *ngFor="let meal of meals | stringFilter: filter | paginate: config">
        {{ meal }}
    </li>
</ul>

<div class="has-text-centered">
    <pagination-controls [id]="config.id"
                         [maxSize]="maxSize"
                         [directionLinks]="directionLinks"
                         [autoHide]="autoHide"
                         [responsive]="responsive"
                         [previousLabel]="labels.previousLabel"
                         [nextLabel]="labels.nextLabel"
                         [screenReaderPaginationLabel]="labels.screenReaderPaginationLabel"
                         [screenReaderPageLabel]="labels.screenReaderPageLabel"
                         [screenReaderCurrentLabel]="labels.screenReaderCurrentLabel"
                         (pageChange)="onPageChange($event)"
                         (pageBoundsCorrection)="onPageBoundsCorrection($event)"></pagination-controls>
</div>

<h3 class="title is-5">Event log</h3>
<div class="event-log">
    <div *ngFor="let event of eventLog">{{ event }}</div>
</div>
`;

const typescriptSource = `
import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {PaginationInstance} from 'ngx-pagination';

@Component({
    selector: 'advanced-example',
    templateUrl: './advanced-example.component.html',
    changeDetection: ChangeDetectionStrategy.Default
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
        screenReaderCurrentLabel: \`You're on page\`
    };
    public eventLog: string[] = [];

    private popped = [];

    onPageChange(number: number) {
        this.logEvent(\`pageChange(\${number})\`);
        this.config.currentPage = number;
    }

    onPageBoundsCorrection(number: number) {
        this.logEvent(\`pageBoundsCorrection(\${number})\`);
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
        this.eventLog.unshift(\`\${new Date().toISOString()}: \${message}\`)
    }
}`;
