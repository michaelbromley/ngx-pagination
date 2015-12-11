import {Pipe} from "angular2/core";
import {PaginationService} from "./pagination-service";

@Pipe({
    name: 'paginate',
    pure: false
})
export class PaginatePipe {

    constructor(private service: PaginationService) {
    }

    public transform(collection: any, args: string[]): any {
        let itemsPerPage = parseInt(args[0]);
        let id = args[1] || this.service.defaultId;
        let start, end;
        let instance = this.service.getInstance(id);

        if (!instance) {
            this.service.register({
                id: id,
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                totalItems: collection.length
            });
        } else if (instance.totalItems !== collection.length) {
            this.service.setTotalItems(id, collection.length);
        }

        console.log('pagination pipe');

        if (collection instanceof Array) {
            itemsPerPage = itemsPerPage || 9999999999;
            start = (this.service.getCurrentPage(id) - 1) * itemsPerPage;
            end = start + itemsPerPage;
            return collection.slice(start, end);
        }

        return collection;
    }
}