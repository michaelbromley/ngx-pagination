import {Component} from "angular2/core";
import {bootstrap} from "angular2/platform/browser";
import {PaginationService} from "../../src/ng2-pagination";
import {BasicExampleCmp} from "./basic-example-cmp";
import {AdvancedExampleCmp} from "./advanced-example-cmp";
import {CustomTemplateExampleCmp} from "./custom-template-example-cmp";
import {ServerExampleCmp} from './server-example-cmp';

const hljs = require('highlight.js');
require('highlight.js/styles/github-gist.css');
require('./style.scss');


@Component({
    selector: 'demo-app',
    template: require('./demo-app.html'),
    directives: [BasicExampleCmp, AdvancedExampleCmp, CustomTemplateExampleCmp, ServerExampleCmp]
})
class DemoApp {

    meals: string[] = [];
    basicCodeT: string = require('./basic-example-cmp.html');
    basicCodeC: string = require('!raw!./basic-example-cmp.ts');
    advancedCodeT: string = require('./advanced-example-cmp.html');
    advancedCodeC: string = require('!raw!./advanced-example-cmp.ts');
    customTemplateCodeT: string = require('./custom-template-example-cmp.html');
    customTemplateCodeC: string = require('!raw!./custom-template-example-cmp.ts');
    serverPagingCodeT: string = require('./server-example-cmp.html');
    serverPagingCodeC: string = require('!raw!./server-example-cmp.ts');
    selectedTab = 'basic';
    basicTab = 'html';
    fullTab = 'html';
    customTab = 'html';
    serverTab = 'html';

    constructor() {
        this.meals = this.generateMeals();
    }

    ngAfterViewInit() {
        this.highlight();
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

bootstrap(DemoApp, [PaginationService]);