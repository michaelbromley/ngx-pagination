import { Component } from '@angular/core';
import { MealsService } from '../../providers/meals.service';
import { HighlightModule } from 'ngx-highlightjs';
import { CustomTemplateExampleComponent } from './custom-template-example.component';

@Component({
    selector: 'custom-page',
    templateUrl: './custom-page.component.html',
    imports: [HighlightModule, CustomTemplateExampleComponent]
})
export class CustomPageComponent {
    templateSource = templateSource;
    typescriptSource = typescriptSource;
    tab: string = 'html';
    meals: string[] = [];

    constructor(private mealsService: MealsService) {
        this.meals = mealsService.getMeals();
    }
}

const templateSource = `
<pagination-template #p="paginationApi"
                     [id]="config.id"
                     (pageChange)="config.currentPage = $event">


    <div class="custom-pagination">
        <div class="pagination-previous" [class.disabled]="p.isFirstPage()">
            <a *ngIf="!p.isFirstPage()" (click)="p.previous()"> < </a>
        </div>

        <div *ngFor="let page of p.pages" [class.current]="p.getCurrent() === page.value">
            <a (click)="p.setCurrent(page.value)" *ngIf="p.getCurrent() !== page.value">
                <span>{{ page.label }}</span>
            </a>
            <div *ngIf="p.getCurrent() === page.value">
                <span>{{ page.label }}</span>
            </div>
        </div>

        <div class="pagination-next" [class.disabled]="p.isLastPage()">
            <a *ngIf="!p.isLastPage()" (click)="p.next()"> > </a>
        </div>
    </div>

</pagination-template>

<ul class="meal-list">
    <li *ngFor="let meal of meals | paginate: config">
        {{ meal }}
    </li>
</ul>`;

const typescriptSource = `
import {ChangeDetectionStrategy, Component, Input} from "@angular/core"
import {PaginationInstance} from 'ngx-pagination';

@Component({
    selector: 'custom-template-example',
    templateUrl: './custom-template-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomTemplateExampleComponent {

    @Input('data') meals: string[] = [];

    public config: PaginationInstance = {
        id: 'custom',
        itemsPerPage: 10,
        currentPage: 1
    };
}
`;
