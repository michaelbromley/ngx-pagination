import {Component} from '@angular/core';
import {MealsService} from '../../providers/meals.service';
import {Highlighter} from '../../providers/highlighter.service';

import * as templateSource from '!!raw-loader!./custom-template-example.component.html';
import * as typescriptSource from '!!raw-loader!./custom-template-example.component.ts';

@Component({
    selector: 'custom-page',
    templateUrl: './custom-page.component.html'
})
export class CustomPageComponent {
    templateSource: string = templateSource.default;
    typescriptSource: string = typescriptSource.default;
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
