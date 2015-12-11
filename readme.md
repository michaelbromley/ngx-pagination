# Angular2 Pagination

This is a **work-in-progress** port of my [angular-utils-pagination](https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination)
module from Angular 1.x to Angular 2.

Currently it is missing many features, but I hope to bring it eventually to full feature-parity with the 1.x version.

The API will not quite be the same, and it should be significantly simpler and easier to develop than the 1.x version.

## Installation

I am currently working with TypeScript 1.7.3, so these instructions may not work with earlier versions.

```
npm install ng2-pagination --save
```


## Example of usage

```TypeScript
import {Component, CORE_DIRECTIVES} from 'angular2/angular2';
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

Using an object allows some more advanced configuration. See the [IPaginationInstance definition](./src/pagination-service.ts)
for an explanation of the available properties.

## To Do

The following features from the 1.x version have not yet been implemented:

- Handling of multiple independent instances within the same component.
- Server-side paging support
- Page-change event support
- Custom template support
- Various style options for the pagination controls template
- Full test suite

## Build

To build, first run  `npm install` to get all the dev dependencies. Then you can use the `npm run build` script to
compile the TypeScript and generate the definition files. `npm run test` will fire up Karma with the Webpack
plugin to run the tests.

## License

MIT