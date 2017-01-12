# Pagination for Angular 2+[![Build Status](https://travis-ci.org/michaelbromley/ng2-pagination.svg?branch=master)](https://travis-ci.org/michaelbromley/ng2-pagination)

This is a port of my [angular-utils-pagination](https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination)
module from Angular 1.x to Angular 2. Due to fundamental differences in the design of Angular from version 2 onwards, the API is different but
the idea is the same - the most simple possible way to add full-featured pagination to an Angular app.

## Demo

Check out the live demo here: http://michaelbromley.github.io/ng2-pagination/

Play with it on Plunker here: http://plnkr.co/edit/JVQMPvV8z2brCIzdG3N4?p=preview

## Quick Start

```
npm install ng2-pagination --save
```

### Angular Version

This library is built to work with **Angular 2.3.0+**, and support ahead-of-time compilation.
If you need to support an earlier or pre-release version of Angular for now, please see the changelog for advice on which version to use.

### CommonJS

ng2-pagination ships as un-bundled CommonJS modules (located in the `dist` folder), which can be imported with 
`require('ng2-pagination');`, or `import` for those environments that support this method (e.g. TypeScript 1.6+).

### System.register

ng2-pagination also ships with a bundle in the system format (`dist/ng2-pagination-bundle.js`), suitable for use with the [es6-module-loader](https://github.com/ModuleLoader/es6-module-loader) 
and related loaders such as SystemJS.

## Simple Example

```TypeScript
// app.module.ts
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Ng2PaginationModule} from 'ng2-pagination'; // <-- import the module
import {MyComponent} from './my.component';

@NgModule({
    imports: [BrowserModule, Ng2PaginationModule], // <-- include it in your app module
    declarations: [MyComponent],
    bootstrap: [MyComponent]
})
export class MyAppModule {}
```

```TypeScript
// my.component.ts
import {Component} from '@angular/core';

@Component({
    selector: 'my-component',
    template: `
    <ul>
      <li *ngFor="let item of collection | paginate: { itemsPerPage: 10, currentPage: p }"> ... </li>
    </ul>
               
    <pagination-controls (pageChange)="p = $event"></pagination-controls>
    `
})
export class MyComponent {
    public collection: any[] = someArrayOfThings;  
}
```

## API

### PaginatePipe

The PaginatePipe should be placed at the end of an NgFor expression. It accepts a single argument, an object conforming 
to the [`PaginationInstance` interface](/src/pagination-instance.ts). The following config options are available:

```HTML
<element *ngFor="let item of collection | paginate: { id: 'foo',
                                                      itemsPerPage: pageSize,
                                                      currentPage: p,
                                                      totalItems: total }">...</element>

```

* **`itemsPerPage`** [`number`] - **required** The number of items to display on each page.
* **`currentPage`** [`number`] - **required** The current (active) page number.
* **`id`** [`string`] If you need to support more than one instance of pagination at a time, set the `id` and ensure it
matches the id attribute of the `PaginationControlsComponent` / `PaginationControlsDirective` (see below).
* **`totalItems`** [`number`] The total number of items in the collection. Only useful when doing server-side paging, 
where the collection size is limited to a single page returned by the server API. For in-memory paging, 
this property should not be set, as it will be automatically set to the value of `collection.length`.

### PaginationControlsComponent

This a default component for displaying pagination controls. It is implemented on top of the `PaginationControlsDirective`, and has a pre-set
template and styles based on the [Foundation 6 pagination component](http://foundation.zurb.com/sites/docs/pagination.html). If you require a more 
customised set of controls, you will need to use the `PaginationControlsDirective` and implement your own component.

```HTML
<pagination-controls  id="some_id"
                      (pageChange)="pageChanged($event)"
                      maxSize="9"
                      directionLinks="true"
                      autoHide="true"
                      previousLabel="Previous"
                      nextLabel="Next"
                      screenReaderPaginationLabel="Pagination"
                      screenReaderPageLabel="page"
                      screenReaderCurrentLabel="You're on page">
</pagination-controls>
```

* **`id`** [`string`] If you need to support more than one instance of pagination at a time, set the `id` and ensure it
matches the id set in the PaginatePipe config.
* **`pageChange`** [`event handler`] The expression specified will be invoked whenever the page changes via a click on one of the
pagination controls. The `$event` argument will be the number of the new page. This should be used to update the value of
the `currentPage` variable which was passed to the `PaginatePipe`.
* **`maxSize`** [`number`] Defines the maximum number of page links to display. Default is `7`.
* **`directionLinks`** [`boolean`] If set to `false`, the "previous" and "next" links will not be displayed. Default is `true`.
* **`autoHide`** [`boolean`] If set to `true`, the pagination controls will not be displayed when all items in the
collection fit onto the first page. Default is `false`.
* **`previousLabel`** [`string`] The label displayed on the "previous" link.
* **`nextLabel`** [`string`] The label displayed on the "next" link.
* **`screenReaderPaginationLabel`** [`string`] The word for "Pagination" used to label the controls for screen readers.
* **`screenReaderPageLabel`** [`string`] The word for "page" used in certain strings generated for screen readers, e.g. "Next page".
* **`screenReaderCurrentLabel`** [`string`] The phrase indicating the current page for screen readers, e.g. "You're on page <x>".

### PaginationControlsDirective

The `PaginationControlsDirective` is used to build components for controlling your pagination instances. The directive selector is `pagination-template`, either as an element or an attribute. 
It exports an API named "paginationApi", which can then be used to build the controls component.

It has the following inputs and outputs:

```TypeScript
@Input() id: string;
@Input() maxSize: number;
@Output() pageChange: EventEmitter<number>;
```

Here is an example of how it would be used to build a custom component:

```HTML
<pagination-template #p="paginationApi"
                     (pageChange)="pageChange.emit($event)">

        <div class="pagination-previous" [class.disabled]="p.isFirstPage()">
            <a *ngIf="!p.isFirstPage()" (click)="p.previous()"> < </a>
        </div>

        <div *ngFor="let page of p.pages" [class.current]="p.getCurrent() === page.value">
            <a (click)="p.setCurrent(page.value)" *ngIf="p.getCurrent() !== page.value">
                <span>{{ page.label }}</span>
            </a>
            <div *ngIf="p.getCurrent() === page.value">
                <span>{{ page.label }}</span>
            </div>
        </div>

        <div class="pagination-next" [class.disabled]="p.isLastPage()">
            <a *ngIf="!p.isLastPage()" (click)="p.next()"> > </a>
        </div>
    
</pagination-template>
```

The key thing to note here is `#p="paginationApi"` - this provides a local variable, `p` (name it however you like), which can be used in the 
template to access the directive's API methods and properties, which are explained below:

* **`pages`** [`{ label: string, value: any }[]`] Array of page objects containing the page number and label.
* **`maxSize`** [`number`]  Corresponds to the value of `maxSize` which is passed to the directive.
* **`getCurrent()`** [`() => number`] Returns the current page number.
* **`setCurrent(val)`** [`(val: number) => void`] Triggers the `pageChange` event with the page number passed as `val`.
* **`previous()`** [`() => void`] Sets current page to previous, triggering the `pageChange` event.
* **`next()`** [`() => void`] Sets current page to next, triggering the `pageChange` event.
* **`isFirstPage()`** [`() => boolean`] Returns true if the current page is the first page.
* **`isLastPage()`** [`() => boolean`] Returns true if the current page is the last page
* **`getLastPage()`** [`() => number`] Returns the page number of the last page.

For a real-world implementation of a custom component, take a look at [the source for the PaginationControlsComponent](/src/pagination-controls.component.ts).

## Styling

The `PaginationControlsComponent` can be styled by simply overriding the default styles. The component does not use view encapsulation, which means you do not need to use operators such as `/deep/` to target it.

To avoid specificity issues, just add your own custom class name to the element, which will allow your styles to override the defaults:

```HTML
// head
<style>
  .my-pagination .ng2-pagination .current {
    background: red;
  }
</style>

// body
<pagination-controls class="my-pagination"><pagination-controls>
```

## Server-Side Paging

In many cases - for example when working with very large data-sets - we do not want to work with the full collection 
in memory, and use some kind of server-side paging, where the server sends just a single page at a time.

This scenario is supported by ng2-pagination by using the `totalItems` config option. 

Given a server response json object like this:

```
{
  "count": 14453,
  "data": [
    { /* item 1 */ },
    { /* item 2 */ },
    { /* item 3 */ },
    { /*   ...  */ },
    { /* item 10 */ }
  ]
}
```

we should pass the value of `count` to the `PaginatePipe` as the `totalItems` argument:

```HTML
<li *ngFor="let item of collection | paginate: { itemsPerPage: 10, currentPage: p, totalItems: res.count }">...</li>
```

This will allow the correct number of page links to be calculated. To see a complete example of this (including
using the `async` pipe), see the [demo](http://michaelbromley.github.io/ng2-pagination/).

## Build

Requires globally-installed node (tested with v5.x) & npm. 

```
npm install
npm run typings:install

npm run test // Karma unit tests
npm run docs:watch // Build the demo/docs app and watch
```

## License

MIT
