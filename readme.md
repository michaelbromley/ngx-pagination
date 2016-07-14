# Angular2 Pagination [![Build Status](https://travis-ci.org/michaelbromley/ng2-pagination.svg?branch=master)](https://travis-ci.org/michaelbromley/ng2-pagination)

This is a port of my [angular-utils-pagination](https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination)
module from Angular 1.x to Angular 2. Due to fundamental differences in the design of Angular2, the API is different but
the idea is the same - the most simple possible way to add full-featured pagination to an Angular app.

## Demo

Check out the live demo here: http://michaelbromley.github.io/ng2-pagination/

Play with it on Plunker here: http://plnkr.co/edit/JVQMPvV8z2brCIzdG3N4?p=preview

## Quick Start

```
npm install ng2-pagination --save
```

### Angular 2 Version

Angular 2 is not yet stable, and API changes are ongoing. Therefore, if encountering errors using this
lib, ensure your version of Angular is compatible. The current version used to develop this lib is angular2 **2.0.0-rc.4 +**.
If you need to support a previous version of Angular 2 for now, please see the changelog for advice on which version to use.

### CommonJS

ng2-pagination ships as un-bundled CommonJS modules (located in the `dist` folder), which can be imported with 
`require('ng2-pagination');`, or `import` for those environments that support this method (e.g. TypeScript 1.6+).

### System.register

ng2-pagination also ships with a bundle in the system format (`dist/ng2-pagination-bundle.js`), suitable for use with the [es6-module-loader](https://github.com/ModuleLoader/es6-module-loader) 
and related loaders such as SystemJS. See the [demo Plunker](http://plnkr.co/edit/JVQMPvV8z2brCIzdG3N4?p=preview) for an example of this.

## Simple Example

```TypeScript
import {Component} from '@angular/core';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination';

@Component({
    selector: 'my-component',
    template: `
    <ul>
      <li *ngFor="let item of collection | paginate: { itemsPerPage: 10, currentPage: p }"> ... </li>
    </ul>
               
    <pagination-controls (pageChange)="p = $event"></pagination-controls>
    `,
    directives: [PaginationControlsCmp],
    pipes: [PaginatePipe],
    providers: [PaginationService]
})
export class MyComponent {

    public collection: any[] = someArrayOfThings;  

}
```

## API

### PaginatePipe

The PaginatePipe should be placed at the end of an NgFor expression. It accepts a single argument, an object conforming 
to the `IPaginationInstance` interface. The following config options are available:

```HTML
<element *ngFor="let item of collection | paginate: { id: 'foo'
                                                   itemsPerPage: pageSize
                                                   currentPage: p
                                                   totalItems: total }">...</element>

```

* **`itemsPerPage`** [`number`] - **required** The number of items to display on each page.
* **`currentPage`** [`number`] - **required** The current (active) page number.
* **`id`** [`string`] If you need to support more than one instance of pagination at a time, set the `id` and ensure it
matches the id set in the PaginatePipe config (see below).
* **`totalItems`** [`number`] The total number of items in the collection. Only useful when doing server-side paging, 
where the collection size is limited to a single page returned by the server API. For in-memory paging, 
this property should not be set, as it will be automatically set to the value of  collection.length.

### PaginationControlsCmp

```HTML
<pagination-controls  id="some_id"
                      (pageChange)="pageChanged($event)"
                      maxSize="9"
                      directionLinks="true"
                      autoHide="true">
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

## Custom Templates

The `PaginationControlsCmp` component has a built-in default template and styles based on the [Foundation 6 pagination
component](http://foundation.zurb.com/sites/docs/pagination.html).

To use a custom template, just place your markup inside the `<pagination-controls></pagination-controls>` tags,
and make a template variable reference with `#` to gain access to the API.

```HTML
<pagination-controls #pagination (pageChange)="currentPage = $event">

    <div class="custom-pagination">

        <div class="pagination-previous" [class.disabled]="pagination.isFirstPage()">
            <a *ngIf="!pagination.isFirstPage()" (click)="pagination.previous()"> < </a>
        </div>

        <div *ngFor="let page of pagination.pages" [class.current]="pagination.getCurrent() === page.value">
            <a (click)="pagination.setCurrent(page.value)" *ngIf="pagination.getCurrent() !== page.value">
                <span>{{ page.label }}</span>
            </a>
            <div *ngIf="pagination.getCurrent() === page.value">
                <span>{{ page.label }}</span>
            </div>
        </div>

        <div class="pagination-next" [class.disabled]="pagination.isLastPage()" *ngIf="pagination.directionLinks">
            <a *ngIf="!pagination.isLastPage()" (click)="pagination.next()"> > </a>
        </div>

    </div>
    
</pagination-controls>
```

The key thing to note here is `#p` - this provides a local variable, `p`, which can be used in the 
template to access the class' API methods and properties, which are explained below:

* **`pages`** [`{ label: string, value: any }[]`] Array of page objects containing the page number and label.
* **`directionLinks`** [`boolean`] Corresponds to the value of `directionLinks` which is passed to the directive.
* **`autoHide`** [`boolean`] Corresponds to the value of `autoHide` which is passed to the directive.
* **`maxSize`** [`number`]  Corresponds to the value of `maxSize` which is passed to the directive.
* **`getCurrent()`** [`() => number`] Returns the current page number.
* **`setCurrent(val)`** [`(val: number) => void`] Triggers the `pageChange` event with the page number passed as `val`.
* **`previous()`** [`() => void`] Sets current page to previous, triggering the `pageChange` event.
* **`next()`** [`() => void`] Sets current page to next, triggering the `pageChange` event.
* **`isFirstPage()`** [`() => boolean`] Returns true if the current page is the first page.
* **`isLastPage()`** [`() => boolean`] Returns true if the current page is the last page/

## Build

Requires globally-installed node (tested with v5.x) & npm. 

```
npm install
npm run typings:install

npm run test // Karma unit tests
npm run demo:watch // Build the demo app and watch
```

## Dart Version

For Dart users, there is a Dart port available here: https://github.com/laagland/ng2-dart-pagination. Note that this 
version was written and is maintained by a different author and may not be up-to-date with this repo.

## License

MIT
