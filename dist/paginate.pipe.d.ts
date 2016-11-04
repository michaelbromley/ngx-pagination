import { PaginationService } from "./pagination.service";
export declare class PaginatePipe {
    private service;
    private state;
    constructor(service: PaginationService);
    transform(collection: any[], args: any): any;
    /**
     * Create an PaginationInstance object, using defaults for any optional properties not supplied.
     */
    private createInstance(collection, args);
    /**
     * Ensure the argument passed to the filter contains the required properties.
     */
    private checkConfig(config);
    /**
     * To avoid returning a brand new array each time the pipe is run, we store the state of the sliced
     * array for a given id. This means that the next time the pipe is run on this collection & id, we just
     * need to check that the collection, start and end points are all identical, and if so, return the
     * last sliced array.
     */
    private saveState(id, collection, slice, start, end);
    /**
     * For a given id, returns true if the collection, size, start and end values are identical.
     */
    private stateIsIdentical(id, collection, start, end);
}
