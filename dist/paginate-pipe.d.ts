import { PaginationService } from "./pagination-service";
export declare class PaginatePipe {
    private service;
    constructor(service: PaginationService);
    transform(collection: any, args: any[]): any;
    private createInstance(collection, args);
}
