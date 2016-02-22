/**
 * The default template and styles for the pagination links are borrowed directly
 * from Zurb Foundation 6: http://foundation.zurb.com/sites/docs/pagination.html
 */

export const DEFAULT_TEMPLATE = `
    <ul class="pagination" role="navigation" aria-label="Pagination">

        <li class="pagination-previous" [class.disabled]="api.isFirstPage()" *ngIf="api.directionLinks">
            <a *ngIf="1 < api.getCurrent()" (click)="api.previous()" aria-label="Next page">
                Previous <span class="show-for-sr">page</span>
            </a>
            <span *ngIf="api.isFirstPage()">Previous <span class="show-for-sr">page</span></span>
        </li>

        <li [class.current]="api.getCurrent() === page.value" *ngFor="#page of api.pages">
            <a (click)="api.setCurrent(page.value)" *ngIf="api.getCurrent() !== page.value">
                <span class="show-for-sr">Page</span>
                <span>{{ page.label }}</span>
            </a>
            <div *ngIf="api.getCurrent() === page.value">
                <span class="show-for-sr">You're on page</span>
                <span>{{ page.label }}</span>
            </div>
        </li>

        <li class="pagination-next" [class.disabled]="api.isLastPage()" *ngIf="api.directionLinks">
            <a *ngIf="!api.isLastPage()" (click)="api.next()" aria-label="Next page">
                Next <span class="show-for-sr">page</span>
            </a>
            <span *ngIf="api.isLastPage()">Next <span class="show-for-sr">page</span></span>
        </li>

    </ul>
    `;

export const DEFAULT_STYLES = `
.pagination {
  margin-left: 0;
  margin-bottom: 1rem; }
  .pagination::before, .pagination::after {
    content: ' ';
    display: table; }
  .pagination::after {
    clear: both; }
  .pagination li {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    font-size: 0.875rem;
    margin-right: 0.0625rem;
    border-radius: 0;
    display: none; }
    .pagination li:last-child, .pagination li:first-child {
      display: inline-block; }
    @media screen and (min-width: 40em) {
      .pagination li {
        display: inline-block; } }
  .pagination a,
  .pagination button {
    color: #0a0a0a;
    display: block;
    padding: 0.1875rem 0.625rem;
    border-radius: 0; }
    .pagination a:hover,
    .pagination button:hover {
      background: #e6e6e6; }
  .pagination .current {
    padding: 0.1875rem 0.625rem;
    background: #2199e8;
    color: #fefefe;
    cursor: default; }
  .pagination .disabled {
    padding: 0.1875rem 0.625rem;
    color: #cacaca;
    cursor: default; }
    .pagination .disabled:hover {
      background: transparent; }
  .pagination .ellipsis::after {
    content: '…';
    padding: 0.1875rem 0.625rem;
    color: #0a0a0a; }

.pagination-previous a::before,
.pagination-previous.disabled::before {
  content: '«';
  display: inline-block;
  margin-right: 0.5rem; }

.pagination-next a::after,
.pagination-next.disabled::after {
  content: '»';
  display: inline-block;
  margin-left: 0.5rem; }

.pagination .show-for-sr {
  position: absolute !important;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0); }`;
