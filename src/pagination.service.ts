import {EventEmitter} from '@angular/core'
import {PaginationInstance} from './pagination-instance';

export class PaginationService {

    public change: EventEmitter<string> = new EventEmitter<string>();

    private instances: { [id: string]: PaginationInstance } = {};
    private DEFAULT_ID = 'DEFAULT_PAGINATION_ID';

    public defaultId(): string { return this.DEFAULT_ID }

    public register(instance: PaginationInstance) {
        if (!instance.id) {
            instance.id = this.DEFAULT_ID;
        }

        if (!this.instances[instance.id]) {
            this.instances[instance.id] = instance;
            this.change.emit(instance.id);
        } else {
            let changed = this.updateInstance(instance);
            if (changed) {
                this.change.emit(instance.id);
            }
        }
    }

    /**
     * Check each property of the instance and update any that have changed. Return
     * true if any changes were made, else return false.
     */
    private updateInstance(instance: PaginationInstance): boolean {
        let changed = false;
        for (let prop in this.instances[instance.id]) {
            if (instance[prop] !== this.instances[instance.id][prop]) {
                this.instances[instance.id][prop] = instance[prop];
                changed = true;
            }
        }
        return changed;
    }

    /**
     * Returns the current page number.
     */
    public getCurrentPage(id: string): number {
        if (this.instances[id]) {
            return this.instances[id].currentPage;
        }
    }

    /**
     * Sets the current page number.
     */
    public setCurrentPage(id: string, page: number) {
        if (this.instances[id]) {
            let instance = this.instances[id];
            let maxPage = Math.ceil(instance.totalItems / instance.itemsPerPage);
            if (page <= maxPage && 1 <= page) {
                this.instances[id].currentPage = page;
                this.change.emit(id);
            }
        }
    }

    /**
     * Sets the value of instance.totalItems
     */
    public setTotalItems(id: string, totalItems: number) {
        if (this.instances[id] && 0 <= totalItems) {
            this.instances[id].totalItems = totalItems;
            this.change.emit(id);
        }
    }

    /**
     * Sets the value of instance.itemsPerPage.
     */
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
    public getInstance(id: string = this.DEFAULT_ID): PaginationInstance {
        if (this.instances[id]) {
            return this.clone(this.instances[id]);
        }
        return <PaginationInstance>{};
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
