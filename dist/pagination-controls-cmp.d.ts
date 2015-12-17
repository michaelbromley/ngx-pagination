import { EventEmitter } from 'angular2/core';
import { PaginationService } from "./pagination-service";
export interface IPage {
    label: string;
    value: any;
}
export declare class PaginationControlsCmp {
    private service;
    private id;
    pageChange: EventEmitter<number>;
    private changeSub;
    pages: IPage[];
    constructor(service: PaginationService);
    /**
     * Set up the subscription to the PaginationService.change observable.
     */
    private ngOnInit();
    private ngOnDestroy();
    /**
     * Set the current page number.
     */
    setCurrent(page: number): void;
    /**
     * Get the current page number.
     */
    getCurrent(): number;
    /**
     * Returns an array of IPage objects to use in the pagination controls.
     */
    private createPageArray(currentPage, itemsPerPage, totalItems, paginationRange?);
    /**
     * Given the position in the sequence of pagination links [i],
     * figure out what page number corresponds to that position.
     */
    private calculatePageNumber(i, currentPage, paginationRange, totalPages);
}
