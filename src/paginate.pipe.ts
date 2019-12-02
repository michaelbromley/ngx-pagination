import {Pipe} from "@angular/core";
import {PaginationService} from "./pagination.service";
import {PaginationInstance} from './pagination-instance';

const LARGE_NUMBER = Number.MAX_SAFE_INTEGER;

export type Collection<T> = T[] | ReadonlyArray<T>;

export interface PaginatePipeArgs {
    id?: string;
    itemsPerPage?: string | number;
    currentPage?: string | number;
    totalItems?: string | number;
}

export interface PipeState {
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

    public transform<T, U extends Collection<T>>(collection: U, args: PaginatePipeArgs): U {

        // When an observable is passed through the AsyncPipe, it will output
        // `null` until the subscription resolves. In this case, we want to
        // use the cached data from the `state` object to prevent the NgFor
        // from flashing empty until the real values arrive.
        if (!(collection instanceof Array)) {
            let _id = args.id || this.service.defaultId();
            if (this.state[_id]) {
                return this.state[_id].slice as U;
            } else {
                return collection;
            }
        }

        let serverSideMode = args.totalItems && args.totalItems !== collection.length;
        let instance = this.createInstance(collection, args);
        let id = instance.id;
        let start, end;
        let perPage = instance.itemsPerPage;

        let emitChange = this.service.register(instance);

        if (!serverSideMode && collection instanceof Array) {
            perPage = +perPage || LARGE_NUMBER;
            start = (instance.currentPage - 1) * perPage;
            end = start + perPage;

            let isIdentical = this.stateIsIdentical(id, collection, start, end);
            if (isIdentical) {
                return this.state[id].slice as U;
            } else {
                let slice = collection.slice(start, end);
                this.saveState(id, collection, slice, start, end);
                this.service.change.emit(id);
                return slice as U;
            }
        } else {
            if (emitChange) {
                this.service.change.emit(id);
            }

            // save the state for server-side collection to avoid null
            // flash as new data loads.
            this.saveState(id, collection, collection, start, end);

            return collection;
        }
    }

    /**
     * Create an PaginationInstance object, using defaults for any optional properties not supplied.
     */
    private createInstance(collection: any[], config: PaginatePipeArgs): PaginationInstance {
        this.checkConfig(config);

        return {
            id: config.id != null ? config.id : this.service.defaultId(),
            itemsPerPage: +config.itemsPerPage || 0,
            currentPage: +config.currentPage || 1,
            totalItems: +config.totalItems || collection.length
        };
    }

    /**
     * Ensure the argument passed to the filter contains the required properties.
     */
    private checkConfig(config: PaginatePipeArgs): void {
        const required = ['itemsPerPage', 'currentPage'];

        const missing = required.filter(prop => !(prop in config));
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
