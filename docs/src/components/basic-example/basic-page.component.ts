import {Component} from '@angular/core';
import {Highlighter} from '../../providers/highlighter.service';
import {MealsService} from '../../providers/meals.service';

@Component({
    selector: 'basic-page',
    templateUrl: './basic-page.component.html'
})
export class BasicPageComponent {
    basicCodeT: string = require('./basic-example.component.html');
    basicCodeC: string = require('!raw-loader!./basic-example.component.ts');
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