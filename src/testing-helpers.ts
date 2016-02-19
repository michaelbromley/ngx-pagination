import {Component, DebugElement} from 'angular2/core';
import {By} from 'angular2/platform/browser';
import {
    ComponentFixture
} from 'angular2/testing';
import {PAGINATION_DIRECTIVES, PaginatePipe, PaginationService, IPaginationInstance} from './ng2-pagination';

/**
 * Helper Functions and test components for use in unit tests.
 */

/**
 * Get an array of the inner items text, e.g. ['item 1', 'item 2', 'item 3' ... ]
 */
export function getListItemsText(fixture: ComponentFixture): string[] {
    return getListItems(fixture).map(el => el.innerText);
}

/**
 * Return all the items in the component's list
 */
export function getListItems(fixture: ComponentFixture): HTMLLIElement[] {
    return fixture.debugElement.queryAll(By.css('.list-item'))
        .map((el: DebugElement) => el.nativeElement);
}

/**
 * Return the list items making up the pagination links, e.g.
 * ['1', '2', '3', '...', '10']
 */
export function getPageLinkItems(fixture: ComponentFixture): string[] {
    return fixture.debugElement.queryAll(By.css('pagination-controls li'))
        .map((el: DebugElement) => el.nativeElement.innerText)
        .filter(str => str.match(/\d+|\.\.\./))
        .map(str => str.match(/\d+|\.\.\./)[0]);
}



/**
 * Test Component
 */
@Component({
    template: `
    <ul>
        <li *ngFor="#item of collection | paginate: config" class="list-item">{{ item }}</li>
    </ul>
    <pagination-controls [id]="config.id"
                         (pageChange)="pageChanged($event)"
                         [maxSize]="maxSize"
                         [directionLinks]="directionLinks"
                         [autoHide]="autoHide">
    </pagination-controls>`,
    directives: [PAGINATION_DIRECTIVES],
    pipes: [PaginatePipe],
    providers: [PaginationService]
})
export class TestCmp {
    maxSize: number = 9;
    directionLinks: boolean = true;
    autoHide: boolean = true;
    collection: string[] = [];
    config: IPaginationInstance = {
        id: 'test',
        itemsPerPage: 10,
        currentPage: 1
    };
    pageChanged() {}

    constructor() {
        this.collection = createCollection();
    }
}

function createCollection(): string[] {
    return Array.from(new Array(100), (x, i) => `item ${i + 1}`);
}