import {Component, DebugElement, Type} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TestBed, ComponentFixture} from '@angular/core/testing';
import {PaginationInstance, PaginatePipe} from './lib/ngx-pagination.module';
import {PaginationControlsDirective} from './lib/pagination-controls.directive';

/**
 * Helper Functions and test components for use in unit tests.
 */

/**
 * Get an array of the inner items text, e.g. ['item 1', 'item 2', 'item 3' ... ]
 */
export function getListItemsText(fixture: ComponentFixture<any>): string[] {
    return getListItems(fixture).map(el => el.innerText);
}

/**
 * Return all the items in the component's list
 */
export function getListItems(fixture: ComponentFixture<any>): HTMLLIElement[] {
    return fixture.debugElement.queryAll(By.css('.list-item'))
        .map((el: DebugElement) => el.nativeElement);
}

/**
 * Returns the PaginationControlsDirective from the template of the ComponentTestComponent.
 */
export function getControlsDirective(fixture: ComponentFixture<ComponentTestComponent>): PaginationControlsDirective {
    return fixture.debugElement.query(By.css('pagination-template')).references['p'];
}

/**
 * Return the list items making up the pagination links, e.g.
 * ['1', '2', '3', '...', '10']
 *
 * If includeAll is set to true, the boundary links will also be included.
 */
export function getPageLinkItems(fixture: ComponentFixture<any>,
                                 selector: string = 'pagination-controls li',
                                 includeAll: boolean = false): string[] {

    let all = fixture.debugElement.queryAll(By.css(selector))
        .filter(el => (el.nativeElement as HTMLLIElement).classList.contains('small-screen') === false)
        .map((el: DebugElement) => el.nativeElement.innerText);

    if (includeAll) {
        return all;
    } else {
        return all.filter(str => {
            return str.match(/\d*\,?\.?\d+|\.\.\./)
        })
            .map(str => str.match(/\d*\,?\.?\d+|\.\.\./)[0]);
    }
}

/**
 * Shortcut function for setting a custom template on a component under test.
 */
export function overrideTemplate<T>(component: Type<T>, templateString: string): void {
    TestBed.overrideComponent(component, {
        set: {
            template: templateString
        }
    });
}

/**
 * Test Component for testing the default controls component
 */
@Component({
    template: `
    <ul>
        <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
    </ul>
    <pagination-controls [id]="config.id"
                         (pageChange)="pageChanged($event)"
                         (pageBoundsCorrection)="pageChangedBoundsCorrection($event)"
                         [maxSize]="maxSize"
                         [directionLinks]="directionLinks"
                         [autoHide]="autoHide"
                         [responsive]="responsive">
    </pagination-controls>`,
    imports: [PaginatePipe],
    standalone: false
})
export class ComponentTestComponent {
    maxSize: number = 9;
    directionLinks: boolean = true;
    autoHide: boolean = true;
    responsive: boolean = false;
    collection: string[] = [];
    config: PaginationInstance = {
        id: 'test',
        itemsPerPage: 10,
        currentPage: 1
    };
    pageChanged() {}
    pageChangedBoundsCorrection(page: number) {}

    constructor() {
        this.collection = Array.from(new Array(100), (x, i) => `item ${i + 1}`);
    }
}
