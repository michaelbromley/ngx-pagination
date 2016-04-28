import {Component, DebugElement} from 'angular2/core';
import {By} from 'angular2/platform/browser';
import {
    ComponentFixture
} from 'angular2/testing';
import {PaginationControlsCmp, PaginatePipe, PaginationService, IPaginationInstance} from './ng2-pagination';

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
 *
 * If includeAll is set to true, the boundary links will also be included.
 */
export function getPageLinkItems(fixture: ComponentFixture,
                                 selector: string = 'pagination-controls li',
                                 includeAll: boolean = false): string[] {
    let all = fixture.debugElement.queryAll(By.css(selector))
        .map((el: DebugElement) => el.nativeElement.innerText);

    if (includeAll) {
        return all;
    } else {
        return all.filter(str => str.match(/\d+|\.\.\./))
            .map(str => str.match(/\d+|\.\.\./)[0]);
    }

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
    directives: [PaginationControlsCmp],
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

/**
 * Test Component - controls first.
 * TODO: would be better to re-use TestCmp with .overrideTemplate(), but I get an error that `paginate` pipe
 * is not found when I do so.
 */
@Component({
    template: `
        <pagination-controls [id]="config.id"></pagination-controls>
        <ul>
            <li *ngFor="#item of collection | paginate: config" class="list-item">{{ item }}</li>
        </ul> `,
    directives: [PaginationControlsCmp],
    pipes: [PaginatePipe],
    providers: [PaginationService]
})
export class TestControlsFirstCmp {
    collection: string[] = [];
    config: IPaginationInstance = {
        id: 'test-controls-first',
        itemsPerPage: 10,
        currentPage: 1
    };
    constructor() {
        this.collection = createCollection();
    }
}

/**
 * Test Component using custom template
 */
@Component({
    template: `
    <ul>
        <li *ngFor="#item of collection | paginate: config" class="list-item">{{ item }}</li>
    </ul>
   <pagination-controls #p [id]="config.id" (pageChange)="config.currentPage = $event">
        <div #template>
            <div class="pagination-previous" [class.disabled]="p.isFirstPage()" *ngIf="p.directionLinks">
                <span *ngIf="!p.isFirstPage()" (click)="p.previous()">back</span>
            </div>

            <div class="page-link" [class.current]="p.getCurrent() === page.value" *ngFor="#page of p.pages">
                <span (click)="p.setCurrent(page.value)">{{ page.label }}</span>
            </div>

            <div class="pagination-next" [class.disabled]="p.isLastPage()" *ngIf="p.directionLinks">
                <span *ngIf="!p.isLastPage()" (click)="p.next()">forward</span>
            </div>
        </div>
   </pagination-controls>`,
    directives: [PaginationControlsCmp],
    pipes: [PaginatePipe],
    providers: [PaginationService]
})
export class TestCustomTemplateCmp {
    maxSize: number = 9;
    directionLinks: boolean = true;
    autoHide: boolean = true;
    collection: string[] = [];
    config: IPaginationInstance = {
        id: 'test-custom-template',
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
