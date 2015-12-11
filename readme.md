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
      <li *ngFor="#item of collection | paginate: ITEMS_PER_PAGE : PAGINATION_ID"> ... </li>
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

## To Do

The following features from the 1.x version have not yet been implemented:

- Handling of multiple independent instances within the same component.
- Server-side paging support
- Page-change event support
- Custom template support
- Various style options for the pagination controls template


## License

MIT