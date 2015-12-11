import {Component, Input, CORE_DIRECTIVES} from 'angular2/angular2'
import {Subscription} from 'rxjs';
import {PaginationService} from "./pagination-service";

export interface IPage {
    label: string;
    value: any;
}

@Component({
    selector: 'kb-pagination-controls',
    template: `
    <ul class="pagination" role="navigation" aria-label="Pagination">

        <li class="pagination-previous" [class.disabled]="getCurrent() === 1">
            <a *ngIf="1 < getCurrent()"
               (click)="setCurrent(getCurrent() - 1)" aria-label="Next page">Previous <span class="show-for-sr">page</span></a>
            <span *ngIf="getCurrent() === 1">Previous <span class="show-for-sr">page</span></span>
        </li>

        <li [class.current]="getCurrent() === page.value" *ngFor="#page of pages">
            <a (click)="setCurrent(page.value)" *ngIf="getCurrent() !== page.value">
                <span class="show-for-sr">Page</span>
                <span>{{ page.label }}</span>
            </a>
            <div *ngIf="getCurrent() === page.value">
                <span class="show-for-sr">You're on page</span>
                <span>{{ page.label }}</span>
            </div>
        </li>

        <li class="pagination-next" [class.disabled]="getCurrent() === pages.length">
            <a *ngIf="getCurrent() < pages.length"
               (click)="setCurrent(getCurrent() + 1)" aria-label="Next page">
                Next <span class="show-for-sr">page</span>
            </a>
            <span *ngIf="getCurrent() === pages.length">Next <span class="show-for-sr">page</span></span>
        </li>

    </ul>
    `,
    directives: [CORE_DIRECTIVES]
})
export class PaginationControlsCmp {

    @Input()
    private id: string;

    private changeSub: Subscription<string>;
    public pages: IPage[] = [];

    constructor(private service: PaginationService) {
    }

    private ngOnInit() {
        if (this.id === undefined) {
            this.id = this.service.defaultId;
        }

        this.changeSub = this.service.change
            .filter(id => this.id === id)
            .subscribe(() => {
                let instance = this.service.getInstance(this.id);
                this.pages = this.createPageArray(instance.currentPage, instance.itemsPerPage, instance.totalItems);
            });
    }

    private ngOnDestroy() {
        // TODO: do i need to manually clean these up??? What's the difference between unsubscribe() and remove()
        this.changeSub.unsubscribe();
    }

    public setCurrent(page: number) {
        this.service.setCurrentPage(this.id, page);
    }

    public getCurrent(): number {
        return this.service.getCurrentPage(this.id);
    }

    public setNext() {

    }

    /**
     * Returns an array of IPage objects to use in the pagination controls.
     */
    private createPageArray(currentPage: number, itemsPerPage: number, totalItems: number, paginationRange: number = 5): IPage[] {
        let pages = [];
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const halfWay = Math.ceil(paginationRange / 2);

        const isStart = currentPage <= halfWay;
        const isEnd = totalPages - halfWay < currentPage;
        const isMiddle = !isStart && !isEnd;

        let ellipsesNeeded = paginationRange < totalPages;
        let i = 1;

        while (i <= totalPages && i <= paginationRange) {
            let label;
            let pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);
            let openingEllipsesNeeded = (i === 2 && (isMiddle || isEnd));
            let closingEllipsesNeeded = (i === paginationRange - 1 && (isMiddle || isStart));
            if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                label = '...';
            } else {
                label = pageNumber;
            }
            pages.push({
                label: label,
                value: pageNumber
            });
            i ++;
        }
        return pages;
    }

    /**
     * Given the position in the sequence of pagination links [i],
     * figure out what page number corresponds to that position.
     */
    private calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
        let halfWay = Math.ceil(paginationRange / 2);
        if (i === paginationRange) {
            return totalPages;
        } else if (i === 1) {
            return i;
        } else if (paginationRange < totalPages) {
            if (totalPages - halfWay < currentPage) {
                return totalPages - paginationRange + i;
            } else if (halfWay < currentPage) {
                return currentPage - halfWay + i;
            } else {
                return i;
            }
        } else {
            return i;
        }
    }
}
