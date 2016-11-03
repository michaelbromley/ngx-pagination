import { Injectable } from '@angular/core';

@Injectable()
export class MealsService {
    meals: string[] = [];

    constructor() {
        this.meals = this.generateMeals();
    }

    getMeals(): string[] {
        return this.meals.slice();
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