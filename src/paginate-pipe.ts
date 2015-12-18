import {Pipe} from "angular2/core";
import {PaginationService} from "./pagination-service";
import {IPaginationInstance} from "../dist/pagination-service";

interface IPipeState {
    collection: any[];
    start: number;
    end: number;
    slice: any[];
}

@Pipe({
    name: 'paginate',
    pure: false
})
export class PaginatePipe {

    // store the values from the last time the pipe
    private state: { [id: string]: IPipeState } = {};

    constructor(private service: PaginationService) {
    }

    public transform(collection: any[], args: any[]): any {
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

            let isIdentical = this.stateIsIdentical(id, collection, start, end);
            if (isIdentical) {
                return this.state[id].slice;
            } else {
                let slice = collection.slice(start, end);
                this.saveState(id, collection, slice, start, end);
                return slice;
            }
        }
        return collection;
    }

    private createInstance(collection: any[], args: any): IPaginationInstance {
        let instance: IPaginationInstance;
        if (typeof args[0] === 'string' || typeof args[0] === 'number') {
            let id = this.service.defaultId;
            instance = {
                id: id,
                itemsPerPage: parseInt(args[0]),
                currentPage: this.service.getCurrentPage(id) || 1,
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

    /**
     * To avoid returning a brand new array each time the pipe is run, we store the state of the sliced
     * array for a given id. This means that the next time the pipe is run on this collection & id, we just
     * need to check that the collection, start and end points are all identical, and if so, return the
     * last sliced array.
     */
    private saveState(id: string, collection: any[], slice: any[], start: number, end: number) {
        this.state[id] = {
            collection,
            slice,
            start,
            end
        };
    }

    /**
     * For a given id, returns true if the collection, start and end values are identical.
     */
    private stateIsIdentical(id: string, collection: any[], start: number, end: number): boolean {
        let state = this.state[id];
        if (!state) {
            return false;
        }

        return state.collection === collection && state.start === start && state.end === end;
    }
}