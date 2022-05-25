import { Component } from '@angular/core';
import { MealsService } from '../../providers/meals.service';

@Component({
    selector: 'basic-page',
    templateUrl: './basic-page.component.html'
})
export class BasicPageComponent {
    basicCodeT = basicCodeT;
    basicCodeC = basicCodeC;
    tab: string = 'html';
    meals: string[] = [];

    constructor(private mealsService: MealsService) {
        this.meals = mealsService.getMeals();
    }
}

const basicCodeT = `
<ul class="meal-list">
    <li *ngFor="let meal of meals | paginate: { itemsPerPage: 10, currentPage: page }">
        {{ meal }}
    </li>
</ul>
<div class="has-text-centered">
    <pagination-controls (pageChange)="page = $event"></pagination-controls>
</div>`;

const basicCodeC = `
import {ChangeDetectionStrategy, Component, Input} from "@angular/core";

@Component({
    selector: 'basic-example',
    templateUrl: './basic-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicExampleComponent {
    @Input('data') meals: string[] = [];
    page: number = 1;
}`;
