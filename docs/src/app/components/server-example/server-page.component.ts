import {Component} from '@angular/core';
import {Highlighter} from '../../providers/highlighter.service';
import {MealsService} from '../../providers/meals.service';

import * as templateSource from '!!raw-loader!./server-example.component.html';
import * as typescriptSource from '!!raw-loader!./server-example.component.ts';

@Component({
    selector: 'server-page',
    templateUrl: './server-page.component.html'
})
export class ServerPageComponent {
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
