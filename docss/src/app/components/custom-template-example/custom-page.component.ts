import {Component} from '@angular/core';
import {MealsService} from '../../providers/meals.service';
import {Highlighter} from '../../providers/highlighter.service';

@Component({
    selector: 'custom-page',
    templateUrl: './custom-page.component.html'
})
export class CustomPageComponent {
    templateSource: string = require('./custom-template-example.component.html');
    typescriptSource: string = require('!raw-loader!./custom-template-example.component.ts');
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