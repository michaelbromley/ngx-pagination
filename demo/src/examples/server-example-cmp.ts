import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {Observable} from 'rxjs/observable';

interface IServerResponse {
    items: string[];
    total: number;
}

@Component({
    selector: 'server-example',
    templateUrl: './server-example-cmp.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerExampleCmp {

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
        this.asyncMeals = serverCall(this.meals, page)
            .do(res => {
                this.total = res.total;
                this.p = page;
                this.loading = false;
            })
            .map(res => res.items);
    }
}

/**
 * Simulate an async HTTP call with a delayed observable.
 */
function serverCall(meals: string[], page: number): Observable<IServerResponse> {
    const perPage = 10;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return Observable
        .of({
            items: meals.slice(start, end),
            total: 100
        }).delay(1000);
}
