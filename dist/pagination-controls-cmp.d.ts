import { EventEmitter, ViewContainerRef } from 'angular2/core';
import { PaginationService } from "./pagination-service";
export interface IPage {
    label: string;
    value: any;
}
export declare class PaginationControlsCmp {
    private service;
    private viewContainer;
    id: string;
    maxSize: number;
    directionLinks: boolean;
    autoHide: boolean;
    pageChange: EventEmitter<number>;
    customTemplate: any;
    private changeSub;
    pages: IPage[];
    constructor(service: PaginationService, viewContainer: ViewContainerRef);
    private updatePages();
    displayDefaultTemplate(): boolean;
    /**
     * Set up the subscription to the PaginationService.change observable.
     */
    private ngOnInit();
    private ngAfterContentInit();
    private ngOnChanges();
    private ngOnDestroy();
    /**
     * Set the current page number.
     */
    setCurrent(page: number): void;
    /**
     * Get the current page number.
     */
    getCurrent(): number;
    isFirstPage(): boolean;
    isLastPage(): boolean;
    /**
     * Returns an array of IPage objects to use in the pagination controls.
     */
    private createPageArray(currentPage, itemsPerPage, totalItems, paginationRange);
    /**
     * Given the position in the sequence of pagination links [i],
     * figure out what page number corresponds to that position.
     */
    private calculatePageNumber(i, currentPage, paginationRange, totalPages);
}
