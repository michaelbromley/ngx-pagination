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

        it('should allow independent instances by setting an id', () => {
            let config1 = {
                id: 'first_one',
                itemsPerPage: 10,
                currentPage: 1
            };
            let config2 = {
                id: 'other_one',
                itemsPerPage: 50,
                currentPage: 2
            };
            let result1 = pipe.transform(collection, [config1]);
            let result2 = pipe.transform(collection, [config2]);

            expect(result1.length).toBe(10);
            expect(result1[0]).toBe('item 0');
            expect(result1[9]).toBe('item 9');

            expect(result2.length).toBe(50);
            expect(result2[0]).toBe('item 50');
            expect(result2[49]).toBe('item 99');
        });

        describe('server-side pagination', () => {
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

        it('should return identical array for the same input values', () => {
            let config = {
                id: 'first_one',
                itemsPerPage: 10,
                currentPage: 1
            };
            let result1 = pipe.transform(collection, [config]);
            let result2 = pipe.transform(collection, [config]);

            expect(result1 === result2).toBe(true);
        });

    });

    describe('unexpected input', () => {

        it('should throw exception on non-array inputs', () => {
            let input;

            input = '';
            expect(() => pipe.transform(<any>input, ['10'])).toThrow();

            input = 1;
            expect(() => pipe.transform(<any>input, ['10'])).toThrow();

            input = {};
            expect(() => pipe.transform(<any>input, ['10'])).toThrow();

            input = null;
            expect(() => pipe.transform(<any>input, ['10'])).toThrow();

            input = undefined;
            expect(() => pipe.transform(<any>input, ['10'])).toThrow();
        });
    });


});