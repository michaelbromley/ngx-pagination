import { PaginationService } from "./pagination-service";
export interface IPage {
    label: string;
    value: any;
}
export declare class PaginationControlsCmp {
    private service;
    private id;
    private changeSub;
    pages: IPage[];
    constructor(service: PaginationService);
    private ngOnInit();
    private ngOnDestroy();
    setCurrent(page: number): void;
    getCurrent(): number;
    setNext(): void;
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
