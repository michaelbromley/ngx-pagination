# Angular2 Pagination

This is a **work-in-progress** port of my [angular-utils-pagination](https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination)
module from Angular 1.x to Angular 2.

It is not yet well production-tested and is currently missing a few features, but I hope to bring it eventually to full 
feature-parity with the 1.x version.

The API will not quite be the same, but it should be significantly simpler and easier to develop than the 1.x version (I hope).

## Demo

Check out the live demo here: http://michaelbromley.github.io/ng2-pagination/

To play with the demo, just clone this repo and start editing the files in the `/demo` folder. The index for the demo is
`index.html` in the root folder.

## Installation

I am currently working with TypeScript 1.7.3, so these instructions may not work with earlier versions.

```
npm install ng2-pagination --save
```


## Example of usage

```TypeScript
import {Component} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {PaginatePipe, PaginationControlsCmp, PaginationService} from 'ng2-pagination';

@Component({
    selector: 'my-component',
    template: `
    <ul>
      <li *ngFor="#item of collection | paginate: [ITEMS_PER_PAGE or CONFIG_OBJECT] "> ... </li>
    <ul>
               
    <pagination-controls></pagination-controls>
    `,
    directives: [CORE_DIRECTIVES, PaginationControlsCmp],
    pipes: [PaginatePipe],
    providers: [PaginationService]
})
export class MyComponent {

    public collection: any[];  

    constructor(private dataService: DataService) {
    }

    ngInit() {
        this.dataService.getCollection()
          .subscribe(result => this.collection = result);
    }

}
```

## API

### PaginatePipe

The PaginatePipe should be placed at the end of an NgFor expression. It accepts a single argument, which should be 
either a `number` or an object confirming to `IPaginationInstance`. If the argument is a number, the number sets the
value of `itemsPerPage`. 

Using an object allows some more advanced configuration. The following config options are available:

```JavaScript
interface IPaginationInstance {
    /**
     * An optional ID for the pagination instance. Only useful if you wish to
     * have more than once instance at a time in a given component.
     */
    id?: string;
    /**
     * The number of items per paginated page.
     */
    itemsPerPage: number;
    /**
     * The current (active) page.
     */
    currentPage: number;
    /**
     * The total number of items in the collection. Only useful when
     * doing server-side paging, where the collection size is limited
     * to a single page returned by the server API.
     *
     * For in-memory paging, this property should not be set, as it
     * will be automatically set to the value of  collection.length.
     */
    totalItems?: number;
}
```


### PaginationControlsCmp

```HTML
<pagination-controls  id="some_id"
                      (change)="pageChanged($event)
                      maxSize="9"
                      autoHide="true">
</pagination-controls>
```

* **`id`** [string] If you need to support more than one instance of pagination at a time, set the `id` and ensure it
matches the id set in the PaginatePipe config.
* **`change`** [function] The function specified will be invoked whenever the page changes via a click on one of the
pagination controls. The `$event` argument will be the number of the new page.
* **maxSize** [number] Defines the maximum number of page links to display. Default is `7`.
* **`autoHide`** [boolean] If set to `true`, the pagination controls will not be displayed when all items in the
collection fit onto the first page. Default is `false`

## To Do

The following features from the 1.x version have not yet been implemented:

- ~~Handling of multiple independent instances within the same component.~~
- ~~Server-side paging support~~
- ~~Page-change event support~~
- Custom template support
- ~~Various style options for the pagination controls template~~
- Full test suite

I have written a few tests, but right now I am waiting for the Angular team to publish some guidelines on how
best to test components.

## Build

To build, first run  `npm install` to get all the dev dependencies. Then you can use the `npm run build` script to
compile the TypeScript and generate the definition files. `npm run test` will fire up Karma with the Webpack
plugin to run the tests.

## License

MIT