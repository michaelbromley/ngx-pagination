import {EventEmitter} from 'angular2/angular2'

export interface IPaginationInstance {
    id: string;
    itemsPerPage: number;
    currentPage: number;
    totalItems: number;
}

export class PaginationService {

    public change: EventEmitter<string> = new EventEmitter();

    private instances: { [id: string]: IPaginationInstance } = {};
    private DEFAULT_ID = 'DEFAULT_PAGINATION_ID';
    get defaultId() { return this.DEFAULT_ID }

    public register(instance: IPaginationInstance) {
        if (!instance.id) {
            instance.id = this.DEFAULT_ID;
        }
        this.instances[instance.id] = instance;
        this.change.emit(instance.id);
    }

    public getCurrentPage(id: string): number {
        if (this.instances[id]) {
            return this.instances[id].currentPage;
        }
    }

    public setCurrentPage(id: string, page: number) {
        if (this.instances[id]) {
            this.instances[id].currentPage = page;
            this.change.emit(id);
        }
    }

    public setTotalItems(id: string, totalItems: number) {
        if (this.instances[id]) {
            this.instances[id].totalItems = totalItems;
            this.change.emit(id);
        }
    }

    public setItemsPerPage(id: string, itemsPerPage: number) {
        if (this.instances[id]) {
            this.instances[id].itemsPerPage = itemsPerPage;
            this.change.emit(id);
        }
    }

    /**
     * Returns a clone of the pagination instance object matching the id. If no
     * id specified, returns the instance corresponding to the default id.
     */
    public getInstance(id: string = this.DEFAULT_ID): IPaginationInstance {
        if (this.instances[id]) {
            return this.clone(this.instances[id]);
        }
    }

    /**
     * Perform a shallow clone of an object.
     */
    private clone(obj: any): any {
        var target = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                target[i] = obj[i];
            }
        }
        return target;
    }

}