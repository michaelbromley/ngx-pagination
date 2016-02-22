import { EventEmitter, ViewContainerRef, ChangeDetectorRef } from 'angular2/core';
import { PaginationService } from "./pagination-service";
export interface IPage {
    label: string;
    value: any;
}
export declare class PaginationControlsBase {
    private service;
    id: string;
    pageChange: EventEmitter<number>;
    /**
     * The api object provides data and methods to be used in the template.
     * The reason it is done this way, rather than just using instance members, is so that we can
     * unify the way the component and directive templates access them.
     */
    api: {
        pages: any[];
        directionLinks: boolean;
        autoHide: boolean;
        maxSize: number;
        getCurrent: () => number;
        setCurrent: (val: any) => void;
        previous: () => void;
        next: () => void;
        isFirstPage: () => boolean;
        isLastPage: () => boolean;
    };
    private changeSub;
    constructor(service: PaginationService);
    updatePages(): void;
    ngOnInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    /**
     * Set the current page number.
     */
    setCurrent(page: number): void;
    /**
     * Get the current page number.
     */
    getCurrent(): number;
    /**
     * Returns the last page number
     */
    getLastPage(): number;
    /**
     * Checks that the instance.currentPage property is within bounds for the current page range.
     * If not, return a correct value for currentPage, or the current value if OK.
     */
    private outOfBoundCorrection(instance);
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
export declare class PaginationControlsDirective extends PaginationControlsBase {
    private viewContainer;
    private cdr;
    id: string;
    maxSize: number;
    directionLinks: boolean;
    autoHide: boolean;
    pageChange: EventEmitter<number>;
    customTemplate: any;
    private templateView;
    constructor(service: PaginationService, viewContainer: ViewContainerRef, cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
}
export declare class PaginationControlsCmp extends PaginationControlsBase {
    id: string;
    maxSize: number;
    directionLinks: boolean;
    autoHide: boolean;
    pageChange: EventEmitter<number>;
    constructor(service: PaginationService);
}
export declare const PAGINATION_DIRECTIVES: (typeof PaginationControlsDirective | typeof PaginationControlsCmp)[];
