import {Pipe} from "@angular/core";
import {PaginationService} from "./pagination.service";
import {PaginationInstance} from './pagination-instance';

const LARGE_NUMBER = Number.MAX_SAFE_INTEGER;

interface PipeState {
    collection: any[];
    size: number;
    start: number;
    end: number;
    slice: any[];
}

@Pipe({
    name: 'paginate',
    pure: false
})
export class PaginatePipe {

    // store the values from the last time the pipe was invoked
    private state: { [id: string]: PipeState } = {};

    constructor(private service: PaginationService) {
    }

    public transform(collection: any[], args: any): any {

        // When an observable is passed through the AsyncPipe, it will output
        // `null` until the subscription resolves. In this case, we want to
        // use the cached data from the `state` object to prevent the NgFor
        // from flashing empty until the real values arrive.
        if (args instanceof Array) {
          // compatible with angular2 before beta16
          args = args[0];
        }
        if (!(collection instanceof Array)) {
            let _id = args.id || this.service.defaultId;
            if (this.state[_id]) {
                return this.state[_id].slice;
            } else {
                return collection;
            }
        }

        let serverSideMode = args.totalItems !== undefined;
        let instance = this.createInstance(collection, args);
        let id = instance.id;
        let start, end;
        let perPage = instance.itemsPerPage;

        this.service.register(instance);

        if (!serverSideMode && collection instanceof Array) {
            perPage = +perPage || LARGE_NUMBER;
            start = (instance.currentPage - 1) * perPage;
            end = start + perPage;

            let isIdentical = this.stateIsIdentical(id, collection, start, end);
            if (isIdentical) {
                return this.state[id].slice;
            } else {
                let slice = collection.slice(start, end);
                this.saveState(id, collection, slice, start, end);
                this.service.change.emit(id);
                return slice;
            }
        }

        // save the state for server-side collection to avoid null
        // flash as new data loads.
        this.saveState(id, collection, collection, start, end);
        return collection;
    }

    /**
     * Create an PaginationInstance object, using defaults for any optional properties not supplied.
     */
    private createInstance(collection: any[], args: any): PaginationInstance {
        let config = args;
        this.checkConfig(config);

        return {
            id: config.id || this.service.defaultId(),
            itemsPerPage: config.itemsPerPage || 0,
            currentPage: config.currentPage || 1,
            totalItems: config.totalItems || collection.length
        };
    }

    /**
     * Ensure the argument passed to the filter contains the required properties.
     */
    private checkConfig(config: any): void {
        const required = ['itemsPerPage', 'currentPage'];

        const missing = required.filter(prop => !config.hasOwnProperty(prop));
        if (0 < missing.length) {
            throw new Error(`PaginatePipe: Argument is missing the following required properties: ${missing.join(', ')}`);
        }
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
            size: collection.length,
            slice,
            start,
            end
        };
    }

    /**
     * For a given id, returns true if the collection, size, start and end values are identical.
     */
    private stateIsIdentical(id: string, collection: any[], start: number, end: number): boolean {
        let state = this.state[id];
        if (!state) {
            return false;
        }
        let isMetaDataIdentical = state.size === collection.length &&
                                  state.start === start &&
                                  state.end === end;

        if(!isMetaDataIdentical) {
            return false;
        }

        return state.slice.every((element, index) => element === collection[start + index]);
    }
}
