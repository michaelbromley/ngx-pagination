import { EventEmitter } from 'angular2/angular2';
export interface IPaginationInstance {
    id: string;
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
}
export declare class PaginationService {
    change: EventEmitter<string>;
    private instances;
    private DEFAULT_ID;
    defaultId: string;
    register(instance: IPaginationInstance): void;
    getCurrentPage(id: string): number;
    setCurrentPage(id: string, page: number): void;
    setTotalItems(id: string, totalItems: number): void;
    setItemsPerPage(id: string, itemsPerPage: number): void;
    /**
     * Returns a clone of the pagination instance object matching the id. If no
     * id specified, returns the instance corresponding to the default id.
     */
    getInstance(id?: string): IPaginationInstance;
    /**
     * Perform a shallow clone of an object.
     */
    private clone(obj);
}
