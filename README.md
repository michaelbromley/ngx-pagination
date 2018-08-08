# Pagination for Angular (v2+)[![Build Status](https://travis-ci.org/michaelbromley/ngx-pagination.svg?branch=master)](https://travis-ci.org/michaelbromley/ngx-pagination)

The simplest solution for pagination in Angular.

## Table of Contents

* [Demo](#demo)
* [Quick Start](#quick-start)
  + [Angular Version](#angular-version)
  + [Module Format](#module-format)
* [Simple Example](#simple-example)
* [API](#api)
  + [PaginatePipe](#paginatepipe)
  + [PaginationControlsComponent](#paginationcontrolscomponent)
  + [PaginationControlsDirective](#paginationcontrolsdirective)
* [Styling](#styling)
* [Server-Side Paging](#server-side-paging)
* [Multiple Instances](#multiple-instances)
* [FAQ](#faq)
  + [Why does my filter not work with pagination?](#why-does-my-filter-not-work-with-pagination)
  + [How do I use the ngFor index with the pagination pipe?](#how-do-i-use-the-ngfor-index-with-the-pagination-pipe)
  + [How do I get the absolute index of a list item?](#how-do-i-get-the-absolute-index-of-a-list-item)
* [Building from source](#building-from-source)
* [Building the docs](#building-the-docs)
* [License](#license)


## Demo

Check out the live demo here: http://michaelbromley.github.io/ngx-pagination/

Play with it on StackBlitz here: https://stackblitz.com/edit/angular-e1f9hq

## Quick Start

```
npm install ngx-pagination --save
```

### Angular Version

This library is built to work with **Angular 2.3.0+**, and support ahead-of-time compilation.
If you need to support an earlier or pre-release version of Angular for now, please see the changelog for advice on which version to use.

### Module Format

This library ships as a "flat ES module" (FESM). This means that all the JavaScript code is located in a single ES5-compatible file, but makes use of ES2015 `import` and `export` statements.

Webpack, Systemjs and Rollup all support this format and should work without problems.

A UMD bundle is also provided for systems which do not support FESM.

## Simple Example

```TypeScript
// app.module.ts
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import {MyComponent} from './my.component';

@NgModule({
    imports: [BrowserModule, NgxPaginationModule], // <-- include it in your app module
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
    p: number = 1;
    collection: any[] = someArrayOfThings;  
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
                      responsive="true"
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
* **`responsive`** [`boolean`] If set to `true`, individual page links will not be displayed on small screens. Default is `false`.
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
* **`getTotalItems()`** [`() => number`] Returns the total number of items in the collection.

For a real-world implementation of a custom component, take a look at [the source for the PaginationControlsComponent](/src/pagination-controls.component.ts).

## Styling

The `PaginationControlsComponent` can be styled by simply overriding the default styles. To overcome Angular's view encapsulation, you may need to use the `/deep/` operator to target it (depending on the type of encapsulation your component is using).

To avoid specificity issues, just add your own custom class name to the element, which will allow your styles to override the defaults:

```HTML
// head
<style>
  .my-pagination /deep/ .ngx-pagination .current {
    background: red;
  }
</style>

// body
<pagination-controls class="my-pagination"><pagination-controls>
```

## Server-Side Paging

In many cases - for example when working with very large data-sets - we do not want to work with the full collection 
in memory, and use some kind of server-side paging, where the server sends just a single page at a time.

This scenario is supported by ngx-pagination by using the `totalItems` config option. 

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
using the `async` pipe), see the [demo](http://michaelbromley.github.io/ngx-pagination/).

## Multiple Instances

It is possible to have any number of pagination pipe/controls pairs in the same template. To do this, just make use of the "id" attribute:

```HTML
<ul>
  <li *ngFor="let item of collection | paginate: { itemsPerPage: 10, currentPage: p1, id: 'first' }"> ... </li>
</ul>
<pagination-controls (pageChange)="p1 = $event" id="first"></pagination-controls>

<ul>
  <li *ngFor="let item of collection | paginate: { itemsPerPage: 10, currentPage: p2, id: 'second' }"> ... </li>
</ul>
<pagination-controls (pageChange)="p2 = $event" id="second"></pagination-controls>
```

You can even have dynamically-generated instances, e.g. within an `ngFor` block:

```TypeScript
export class MyComponent {
  p: number[] = [];
}
```

```HTML
<div *ngFor="let id of [1, 2]; let i = index;">
  <ul>
    <li *ngFor="let item of collection | paginate: { itemsPerPage: 10, currentPage: p[i], id: id }">{{ item }}</li>
   </ul>
   <pagination-controls (pageChange)="p[i] = $event" [id]="id"></pagination-controls>
</div>
```

## FAQ

### Why does my filter not work with pagination?

A common issue is that people have trouble combining some kind of filter pipe with the paginate pipe. The typical symptom is that only the contents of the current page are filtered. The reason is that **the paginate pipe must come after the filter pipe**:

```HTML
<ul>
  <li *ngFor="let item of collection | paginate: config | filter: queryString">WRONG</li> <-- This will not work as expected
</ul>

<ul>
  <li *ngFor="let item of collection | filter: queryString | paginate: config">CORRECT</li>
</ul>
```

### How do I use the ngFor index with the pagination pipe?

If you need to use the index of the `*ngFor` in combination with pagination pipe, **the index should be declared after the pagination pipe**:

```HTML
<ul>
  <li *ngFor="let item of collection; let i = index | paginate: config">WRONG</li>
</ul>

<ul>
  <li *ngFor="let item of collection | paginate: config; let i = index">CORRECT</li>
</ul>
```

### How do I get the absolute index of a list item?

Using the `index` variable exposed by `ngFor` will always give you the index of the items relative to the current page. For example, if you have 10 items per page, you might expect the first item on page 2 to have an index value of 10, whereas you will find the index value to be 0. This is because `ngFor` has no knowledge of the pagination, it only ever knows about the 10 items of the current page.

However, the absolute index can be calculated according to the following formula:

```TypeScript
absoluteIndex(indexOnPage: number): number {
  return this.itemsPerPage * (this.currentPage - 1) + indexOnPage;
}
```
In a template this would look something like:
```HTML
<ul>
  <li *ngFor="let item of collection | paginate: { currentPage: currentPage, itemsPerPage: itemsPerPage }; let i = index">
    {{ itemsPerPage * (currentPage - 1) + i }}
  </li>
</ul>
```

## Building from source

Requires globally-installed node (tested with v5.x) & npm. 

```
npm install
npm run test
npm run build 
```
`test` runs the Karma tests once. You can also use `test:watch` to keep tests running in watch mode.

`npm run build` creates an intermediate `/build` folder, but the final output of the lib (which gets published to npm) is in the `/dist` folder.

## Building the docs
```
cd docs
npm install
npm run docs:watch // dev mode
npm run docs:dist // production mode
```

When in dev mode, serve the `/docs` folder with an http server, and go to `http://localhost:<port>/index-dev.html` in your browser.


## License

MIT
