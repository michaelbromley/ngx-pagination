import {Component, enableProdMode} from "angular2/core";
import {Http, HTTP_PROVIDERS} from "angular2/http";
import {CORE_DIRECTIVES} from "angular2/common";
import {bootstrap} from "angular2/platform/browser";
import {BasicExampleCmp} from "./basic-example-cmp";
import {PaginationService} from "../src/ng2-pagination";
import {AdvancedExampleCmp} from "./advanced-example-cmp";

declare var hljs: any;

@Component({
    selector: 'demo-app',
    templateUrl: 'demo/demo-app.html',
    directives: [BasicExampleCmp, AdvancedExampleCmp],
    providers: [CORE_DIRECTIVES]
})
class DemoApp {

    public meals: string[] = [];
    public basicCode: string = '';
    public advancedCode: string = '';

    constructor(private http: Http) {}

    ngOnInit() {
        this.meals = this.generateMeals();
        this.loadCodeSnippet('basicCode', 'demo/basic-example-cmp.html');
        this.loadCodeSnippet('advancedCode', 'demo/advanced-example-cmp.html');
    }

    /**
     * Load the example component HTML into a string and attach to the controller.
     */
    private loadCodeSnippet(name: string, url: string) {
        this.http.get(url)
            .subscribe(result => {
                this[name] = result.text();
                this.highlight();
            });
    }

    /**
     * Run highlight.js, giving time for DOM to update.
     */
    private highlight() {
        setTimeout(() => hljs.initHighlighting());
    }

    private generateMeals(): string[] {
        let meals = [];
        const dishes = [
            'noodles',
            'sausage',
            'beans on toast',
            'cheeseburger',
            'battered mars bar',
            'crisp butty',
            'yorkshire pudding',
            'wiener schnitzel',
            'sauerkraut mit ei',
            'salad',
            'onion soup',
            'bak choi',
            'avacado maki'
        ];
        const sides = [
            'with chips',
            'a la king',
            'drizzled with cheese sauce',
            'with a side salad',
            'on toast',
            'with ketchup',
            'on a bed of cabbage',
            'wrapped in streaky bacon',
            'on a stick with cheese',
            'in pitta bread'
        ];
        for (var i = 1; i <= 100; i++) {
            var dish = dishes[Math.floor(Math.random() * dishes.length)];
            var side = sides[Math.floor(Math.random() * sides.length)];
            meals.push('meal ' + i + ': ' + dish + ' ' + side);
        }
        return meals;
    }
}

//enableProdMode();
bootstrap(DemoApp, [HTTP_PROVIDERS, PaginationService]);