import {Component} from '@angular/core';
import {Highlighter} from '../../providers/highlighter.service';
import {MealsService} from '../../providers/meals.service';

import * as basicCodeT from '!!raw-loader!./basic-example.component.html';
import * as basicCodeC from '!!raw-loader!./basic-example.component.ts';

@Component({
    selector: 'basic-page',
    templateUrl: './basic-page.component.html'
})
export class BasicPageComponent {
    basicCodeT: string = basicCodeT.default;
    basicCodeC: string = basicCodeC.default;
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
