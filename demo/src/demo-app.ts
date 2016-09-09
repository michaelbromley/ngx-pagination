import {Component, ViewEncapsulation} from "@angular/core";

const hljs = require('highlight.js');

@Component({
    selector: 'demo-app',
    template: require('./demo-app.html'),
    styles: [require('./style.scss'), require('highlight.js/styles/github-gist.css')],
    encapsulation: ViewEncapsulation.None
})
export class DemoApp {

    meals: string[] = [];
    basicCodeT: string = require('./examples/basic-example-cmp.html');
    basicCodeC: string = require('!raw!./examples/basic-example-cmp.ts');
    advancedCodeT: string = require('./examples/advanced-example-cmp.html');
    advancedCodeC: string = require('!raw!./examples/advanced-example-cmp.ts');
    customTemplateCodeT: string = require('./examples/custom-template-example-cmp.html');
    customTemplateCodeC: string = require('!raw!./examples/custom-template-example-cmp.ts');
    serverPagingCodeT: string = require('./examples/server-example-cmp.html');
    serverPagingCodeC: string = require('!raw!./examples/server-example-cmp.ts');
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
