import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {Observable, of} from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgClass, NgFor, AsyncPipe } from '@angular/common';

interface IServerResponse {
    items: string[];
    total: number;
}

@Component({
    selector: 'server-example',
    templateUrl: './server-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgxPaginationModule, NgClass, NgFor, AsyncPipe]
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
