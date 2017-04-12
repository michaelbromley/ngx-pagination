import {Component} from '@angular/core';
import {MealsService} from '../../providers/meals.service';
import {Highlighter} from '../../providers/highlighter.service';

@Component({
    selector: 'advanced-page',
    templateUrl: './advanced-page.component.html'
})
export class AdvancedPageComponent {
    templateSource: string = require('./advanced-example.component.html');
    typescriptSource: string = require('!raw-loader!./advanced-example.component.ts');
    tab: string = 'html';
    meals: string[] = [];

    constructor(private highlighter: Highlighter,
                private mealsService: MealsService) {
        this.meals = mealsService.getMeals();
    }

    ngAfterViewInit() {
        this.highlighter.highlight();
    }
}
