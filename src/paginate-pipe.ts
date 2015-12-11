import {Pipe} from "angular2/core";
import {PaginationService} from "./pagination-service";
import {IPaginationInstance} from "../dist/pagination-service";


@Pipe({
    name: 'paginate',
    pure: false
})
export class PaginatePipe {

    constructor(private service: PaginationService) {
    }

    public transform(collection: any, args: any[]): any {
        let usingConfig = typeof args[0] === 'object';
        let serverSideMode = usingConfig && args[0].totalItems !== undefined;
        let instance; // = this.service.getInstance(id);
        let id = usingConfig ? args[0].id : this.service.defaultId;
        let start, end;

        instance = this.createInstance(collection, args);
        this.service.register(instance);

        if (!usingConfig && instance.totalItems !== collection.length) {
            this.service.setTotalItems(id, collection.length);
        }
        let itemsPerPage = instance.itemsPerPage;
        if (!serverSideMode && collection instanceof Array) {
            itemsPerPage = itemsPerPage || 9999999999;
            start = (this.service.getCurrentPage(id) - 1) * itemsPerPage;
            end = start + itemsPerPage;
            return collection.slice(start, end);
        }
        return collection;
    }

    private createInstance(collection: any, args: any): IPaginationInstance {
        let instance: IPaginationInstance;
        if (typeof args[0] === 'string' || typeof args[0] === 'number') {
            instance = {
                id: this.service.defaultId,
                itemsPerPage: parseInt(args[0]),
                currentPage: 1,
                totalItems: collection.length
            };
        } else if (typeof args[0] === 'object') {
            instance = {
                id: args[0].id || this.service.defaultId,
                itemsPerPage: args[0].itemsPerPage,
                currentPage: args[0].currentPage,
                totalItems: args[0].totalItems || collection.length
            };
        } else {
            throw new Error(`PaginatePipe: Argument must be a string, number or an object. Got ${typeof args[0]}`);
        }
        return instance;
    }
}