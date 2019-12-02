import {ChangeDetectorRef, Directive, EventEmitter, Input, Output} from '@angular/core';
import {Subscription} from 'rxjs';

import {PaginationService} from './pagination.service';
import {PaginationInstance} from './pagination-instance';

export interface Page {
    label: string;
    value: any;
}

/**
 * This directive is what powers all pagination controls components, including the default one.
 * It exposes an API which is hooked up to the PaginationService to keep the PaginatePipe in sync
 * with the pagination controls.
 */
@Directive({
    selector: 'pagination-template,[pagination-template]',
    exportAs: 'paginationApi'
})
export class PaginationControlsDirective {
    @Input() id: string;
    @Input() maxSize: number = 7;
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
    @Output() pageBoundsCorrection: EventEmitter<number> = new EventEmitter<number>();
    pages: Page[] = [];

    private changeSub: Subscription;

    constructor(private service: PaginationService,
                private changeDetectorRef: ChangeDetectorRef) {
        this.changeSub = this.service.change
            .subscribe(id => {
                if (this.id === id) {
                    this.updatePageLinks();
                    this.changeDetectorRef.markForCheck();
                    this.changeDetectorRef.detectChanges();
                }
            });
    }

    ngOnInit() {
        if (this.id === undefined) {
            this.id = this.service.defaultId();
        }
        this.updatePageLinks();
    }

    ngOnChanges(changes: any) {
        this.updatePageLinks();
    }

    ngOnDestroy() {
        this.changeSub.unsubscribe();
    }

    /**
     * Go to the previous page
     */
    previous() {
        this.checkValidId();
        this.setCurrent(this.getCurrent() - 1);
    }

    /**
     * Go to the next page
     */
    next() {
        this.checkValidId();
        this.setCurrent(this.getCurrent() + 1);
    }

    /**
     * Returns true if current page is first page
     */
    isFirstPage(): boolean {
        return this.getCurrent() === 1;
    }

    /**
     * Returns true if current page is last page
     */
    isLastPage(): boolean {
        return this.getLastPage() === this.getCurrent();
    }

    /**
     * Set the current page number.
     */
    setCurrent(page: number) {
        this.pageChange.emit(page);
    }

    /**
     * Get the current page number.
     */
    getCurrent(): number {
        return this.service.getCurrentPage(this.id);
    }

    /**
     * Returns the last page number
     */
    getLastPage(): number {
        let inst = this.service.getInstance(this.id);
        if (inst.totalItems < 1) {
            // when there are 0 or fewer (an error case) items, there are no "pages" as such,
            // but it makes sense to consider a single, empty page as the last page.
            return 1;
        }
        return Math.ceil(inst.totalItems / inst.itemsPerPage);
    }

    getTotalItems(): number {
        return this.service.getInstance(this.id).totalItems;
    }

    private checkValidId() {
        if (this.service.getInstance(this.id).id == null) {
            console.warn(`PaginationControlsDirective: the specified id "${this.id}" does not match any registered PaginationInstance`);
        }
    }

    /**
     * Updates the page links and checks that the current page is valid. Should run whenever the
     * PaginationService.change stream emits a value matching the current ID, or when any of the
     * input values changes.
     */
    private updatePageLinks() {
        let inst = this.service.getInstance(this.id);
        const correctedCurrentPage = this.outOfBoundCorrection(inst);

        if (correctedCurrentPage !== inst.currentPage) {
            setTimeout(() => {
                this.pageBoundsCorrection.emit(correctedCurrentPage);
                this.pages = this.createPageArray(inst.currentPage, inst.itemsPerPage, inst.totalItems, this.maxSize);
            });
        } else {
            this.pages = this.createPageArray(inst.currentPage, inst.itemsPerPage, inst.totalItems, this.maxSize);
        }
    }

    /**
     * Checks that the instance.currentPage property is within bounds for the current page range.
     * If not, return a correct value for currentPage, or the current value if OK.
     */
    private outOfBoundCorrection(instance: PaginationInstance): number {
        const totalPages = Math.ceil(instance.totalItems / instance.itemsPerPage);
        if (totalPages < instance.currentPage && 0 < totalPages) {
            return totalPages;
        } else if (instance.currentPage < 1) {
            return 1;
        }

        return instance.currentPage;
    }

    /**
     * Returns an array of Page objects to use in the pagination controls.
     */
    private createPageArray(currentPage: number, itemsPerPage: number, totalItems: number, paginationRange: number): Page[] {
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
