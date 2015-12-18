import {Component, Input, Output, EventEmitter} from 'angular2/core'
import {CORE_DIRECTIVES} from 'angular2/common'
import {Subscription} from 'rxjs';
import {PaginationService} from "./pagination-service";

export interface IPage {
    label: string;
    value: any;
}

const DEFAULT_TEMPLATE = `
    <ul class="pagination" role="navigation" aria-label="Pagination" *ngIf="!autoHide || pages.length === 0">

        <li class="pagination-previous" [class.disabled]="isFirstPage()" *ngIf="directionLinks">
            <a *ngIf="1 < getCurrent()" (click)="setCurrent(getCurrent() - 1)" aria-label="Next page">
                Previous <span class="show-for-sr">page</span>
            </a>
            <span *ngIf="isFirstPage()">Previous <span class="show-for-sr">page</span></span>
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

        <li class="pagination-next" [class.disabled]="isLastPage()" *ngIf="directionLinks">
            <a *ngIf="!isLastPage()" (click)="setCurrent(getCurrent() + 1)" aria-label="Next page">
                Next <span class="show-for-sr">page</span>
            </a>
            <span *ngIf="isLastPage()">Next <span class="show-for-sr">page</span></span>
        </li>

    </ul>
    `;

function getTemplate(): string {
    return PaginationService.template || DEFAULT_TEMPLATE;
}

@Component({
    selector: 'pagination-controls',
    template: getTemplate(),
    directives: [CORE_DIRECTIVES]
})
export class PaginationControlsCmp {

    @Input() id: string;
    @Input() maxSize: number = 7;
    @Input() directionLinks: boolean = true;
    @Input() autoHide: boolean = false;

    @Output() pageChange: EventEmitter<number> = new EventEmitter();


    private changeSub: Subscription<string>;
    public pages: IPage[] = [];

    constructor(private service: PaginationService) {
    }

    /**
     * Set up the subscription to the PaginationService.change observable.
     */
    private ngOnInit() {
        if (this.id === undefined) {
            this.id = this.service.defaultId;
        }

        this.changeSub = this.service.change
            .subscribe(id => {
                if (this.id === id) {
                    let inst = this.service.getInstance(this.id);
                    this.pages = this.createPageArray(inst.currentPage, inst.itemsPerPage, inst.totalItems, this.maxSize);
                }
            });
    }

    private ngOnDestroy() {
        // TODO: do i need to manually clean these up??? What's the difference between unsubscribe() and remove()
        this.changeSub.unsubscribe();
    }

    /**
     * Set the current page number.
     */
    public setCurrent(page: number) {
        this.service.setCurrentPage(this.id, page);
        this.pageChange.emit(this.service.getCurrentPage(this.id));
    }

    /**
     * Get the current page number.
     */
    public getCurrent(): number {
        return this.service.getCurrentPage(this.id);
    }

    public isFirstPage(): boolean {
        return this.getCurrent() === 1;
    }

    public isLastPage(): boolean {
        let inst = this.service.getInstance(this.id);
        return Math.ceil(inst.totalItems / inst.itemsPerPage) === inst.currentPage;
    }

    /**
     * Returns an array of IPage objects to use in the pagination controls.
     */
    private createPageArray(currentPage: number, itemsPerPage: number, totalItems: number, paginationRange: number): IPage[] {
        // paginationRange could be a string if passed from attribute, so cast to number.
        paginationRange = +paginationRange;
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
