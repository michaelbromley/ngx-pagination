import { Component } from '@angular/core';
import { MealsService } from '../../providers/meals.service';
import { HighlightModule } from 'ngx-highlightjs';
import { ServerExampleComponent } from './server-example.component';

@Component({
    selector: 'server-page',
    templateUrl: './server-page.component.html',
    imports: [HighlightModule, ServerExampleComponent]
})
export class ServerPageComponent {
    templateSource = templateSource;
    typescriptSource = typescriptSource;
    tab: string = 'html';
    meals: string[] = [];

    constructor(private mealsService: MealsService) {
        this.meals = mealsService.getMeals();
    }
}


const templateSource = `
<ul class="meal-list">
    <li *ngFor="let meal of asyncMeals | async | paginate: { id: 'server', itemsPerPage: 10, currentPage: p, totalItems: total }">
        {{ meal }}
    </li>
</ul>

<div class="has-text-centered">
    <div class="spinner" [ngClass]="{ 'hidden': !loading }"></div>
    <pagination-controls (pageChange)="getPage($event)" id="server"></pagination-controls>
</div>
`;

const typescriptSource = `
import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {Observable, of} from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

interface IServerResponse {
    items: string[];
    total: number;
}

@Component({
    selector: 'server-example',
    templateUrl: './server-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerExampleComponent {

    @Input('data') meals: string[] = [];
    asyncMeals: Observable<string[]>;
    p: number = 1;
    total: number;
    loading: boolean;

    ngOnInit() {
        this.getPage(1);
    }

    getPage(page: number) {
        this.loading = true;
        this.asyncMeals = serverCall(this.meals, page).pipe(
            tap(res => {
                this.total = res.total;
                this.p = page;
                this.loading = false;
            }),
            map(res => res.items)
        );
    }
}

/**
 * Simulate an async HTTP call with a delayed observable.
 */
function serverCall(meals: string[], page: number): Observable<IServerResponse> {
    const perPage = 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return of({
            items: meals.slice(start, end),
            total: 100
        }).pipe(delay(1000));
}
`;
