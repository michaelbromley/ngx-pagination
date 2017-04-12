import {Component} from '@angular/core';
import {Highlighter} from '../../providers/highlighter.service';
import {MealsService} from '../../providers/meals.service';

@Component({
    selector: 'server-page',
    templateUrl: './server-page.component.html'
})
export class ServerPageComponent {
    templateSource: string = require('./server-example.component.html');
    typescriptSource: string = require('!raw-loader!./server-example.component.ts');
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