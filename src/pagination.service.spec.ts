import {PaginationService} from "./pagination.service";
import {PaginationInstance} from './pagination-instance';

describe('PaginationService:', () => {
    let service: PaginationService;
    let instance: PaginationInstance;
    const ID = 'test';

    beforeEach(() => {
        service = new PaginationService();
        instance = {
            id: ID,
            itemsPerPage: 10,
            totalItems: 100,
            currentPage: 1
        }
    });

    it('should register the instance', () => {
        service.register(instance);
        expect(service.getInstance(ID)).toEqual(instance);
    });

    it('should allow an id of 0', () => {
        instance.id = 0 as any;
        service.register(instance);
        expect(service.getInstance(0 as any)).toEqual(instance);
    });

    it('getInstance() should return a clone of the instance', () => {
        service.register(instance);
        expect(service.getInstance(ID)).not.toBe(instance);
    });

    it('setCurrentPage() should work for valid page number', () => {
        service.register(instance);
        service.setCurrentPage(ID, 3);
        expect(service.getCurrentPage(ID)).toBe(3);
    });

    it('setCurrentPage() should work for max page number', () => {
        service.register(instance);
        service.setCurrentPage(ID, 10);
        expect(service.getCurrentPage(ID)).toBe(10);
    });

    it('setCurrentPage() should not change page if new page is too high', () => {
        service.register(instance);
        service.setCurrentPage(ID, 11);
        expect(service.getCurrentPage(ID)).toBe(1);
    });

    it('setCurrentPage() should not change page if new page is less than 1', () => {
        service.register(instance);
        service.setCurrentPage(ID, 0);
        expect(service.getCurrentPage(ID)).toBe(1);
    });

    it('setTotalItems() should work for valid input', () => {
        service.register(instance);
        service.setTotalItems(ID, 500);
        expect(service.getInstance(ID).totalItems).toBe(500);
    });

    it('setTotalItems() should not work for negative values', () => {
        service.register(instance);
        service.setTotalItems(ID, -10);
        expect(service.getInstance(ID).totalItems).toBe(100);
    });

});
