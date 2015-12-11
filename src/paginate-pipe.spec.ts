import {PaginatePipe} from "./paginate-pipe";
import {PaginationService} from "./pagination-service";
import {IPaginationInstance} from "../dist/pagination-service";

describe('paginate pipe', () => {
    let pipe: PaginatePipe;
    let paginationService: PaginationService;
    let collection;

    beforeEach(() => {
        paginationService = new PaginationService();
        pipe = new PaginatePipe(paginationService);

        collection = [];
        for (let i = 0; i < 100; i++) {
            collection.push(`item ${i}`);
        }
    });

    describe('simple number argument', () => {

        it('should truncate collection', () => {
            let result = pipe.transform(collection, ['10']);

            expect(result.length).toBe(10);
            expect(result[0]).toBe('item 0');
            expect(result[9]).toBe('item 9');
        });

        it('should register with the PaginationService', () => {
            pipe.transform(collection, ['10']);
            let instance = paginationService.getInstance();
            expect(instance).toBeDefined();
            expect(instance.itemsPerPage).toBe(10);
            expect(instance.totalItems).toBe(100);
        });

        it('should modify the same instance when called multiple times', () => {
            let instance;

            pipe.transform(collection, ['10']);
            instance = paginationService.getInstance();
            expect(instance.itemsPerPage).toBe(10);

            pipe.transform(collection, ['50']);
            instance = paginationService.getInstance();
            expect(instance.itemsPerPage).toBe(50);
        });
    });

    describe('config object argument', () => {

        let config: IPaginationInstance;

        beforeEach(() => {
            config = {
                itemsPerPage: 10,
                currentPage: 1,
                totalItems: 500
            };

            collection = collection.slice(0, 10);
        });

        it('should truncate collection', () => {
            let result = pipe.transform(collection, [config]);

            expect(result.length).toBe(10);
            expect(result[0]).toBe('item 0');
            expect(result[9]).toBe('item 9');
        });

    });


});