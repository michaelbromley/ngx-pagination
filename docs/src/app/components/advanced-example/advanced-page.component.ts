import {Component} from '@angular/core';
import {MealsService} from '../../providers/meals.service';
import {Highlighter} from '../../providers/highlighter.service';

import * as basicCodeT from '!!raw-loader!./advanced-example.component.html';
import * as basicCodeC from '!!raw-loader!./advanced-example.component.ts';

@Component({
    selector: 'advanced-page',
    templateUrl: './advanced-page.component.html'
})
export class AdvancedPageComponent {
    templateSource: string = basicCodeT.default;
    typescriptSource: string = basicCodeC.default;
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
