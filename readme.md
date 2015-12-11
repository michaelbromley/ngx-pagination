# Angular2 Pagination

This is a work-in-progress port of my [angular-utils-pagination](https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination)
module from Angular 1.x to Angular 2.

Currently it is missing many features, but I hope to bring it eventually to full feature-parity with the 1.x version.

The API will not quite be the same, and it should be significantly simpler and easier to develop than the 1.x version.

```HTML
<ul>
  <li *ngFor="#item of collection | paginate: ITEMS_PER_PAGE : PAGINATION_ID"> ... </li>
<ul>

<pagination-controls></pagination-controls>
```

```TypeScript
import 