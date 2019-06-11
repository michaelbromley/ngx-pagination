import {async, TestBed} from '@angular/core/testing';
import {getListItems, getListItemsText, ComponentTestComponent} from './testing/testing-helpers';
import {PaginationControlsComponent} from './pagination-controls.component';
import {PaginationService} from './pagination.service';
import {PaginatePipe} from './paginate.pipe';
import {PaginationControlsDirective} from './pagination-controls.directive';
import {PaginationInstance} from './pagination-instance';

describe('PaginatePipe:', () => {
    let pipe: PaginatePipe;
    let paginationService: PaginationService;
    let collection;

    beforeEach(() => {
        paginationService = new PaginationService();
        pipe = new PaginatePipe(paginationService);

        collection = [];
        for (let i = 0; i < 100; i++) {
            collection.push(`item ${i + 1}`);
        }
    });

    it('should truncate collection', () => {
        let result = pipe.transform(collection, { itemsPerPage: 10, currentPage: 1 });

        expect(result.length).toBe(10);
        expect(result[0]).toBe('item 1');
        expect(result[9]).toBe('item 10');
    });

    it('should register with the PaginationService', () => {
        pipe.transform(collection, { itemsPerPage: 10, currentPage: 1 });
        let instance = paginationService.getInstance();
        expect(instance).toBeDefined();
        expect(instance.itemsPerPage).toBe(10);
        expect(instance.totalItems).toBe(100);
    });

    it('should modify the same instance when called multiple times', () => {
        let instance;

        pipe.transform(collection, { itemsPerPage: 10, currentPage: 1 });
        instance = paginationService.getInstance();
        expect(instance.itemsPerPage).toBe(10);

        pipe.transform(collection, { itemsPerPage: 50, currentPage: 1 });
        instance = paginationService.getInstance();
        expect(instance.itemsPerPage).toBe(50);
    });

    it('should use default id if none specified', () => {
        let config = {
            itemsPerPage: 10,
            currentPage: 1
        };

        expect(paginationService.getInstance()).toEqual({});
        pipe.transform(collection, config);
        expect(paginationService.getInstance()).toBeDefined();
    });

    it('should not break when totalItems is specified for in-memory paging', () => {
        let config = {
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: 100
        };

        let result = pipe.transform(collection, config);
        expect(result.length).toBe(10);
        expect(result[0]).toBe('item 1');
        expect(result[9]).toBe('item 10');
    });

    describe('collection modification', () => {
        it('should detect simple push or splice without insert', () => {
            let config = {
                itemsPerPage: 10,
                currentPage: 1
            };
            collection = ['1', '2', '3'];
            let result1 = pipe.transform(collection, config);

            expect(result1.length).toBe(3);

            collection.push('4');
            let result2 = pipe.transform(collection, config);

            expect(result2.length).toBe(4);

            collection.splice(3, 1); // remove 4th
            let result3 = pipe.transform(collection, config);

            expect(result3.length).toBe(3);

            collection.shift(); // remove 1st
            let result4 = pipe.transform(collection, config);

            expect(result4.length).toBe(2);
        });

        it('should detect value changes in collection', () => {
            let config = {
                itemsPerPage: 10,
                currentPage: 1
            };
            collection = ['not changed', '2', '3'];
            pipe.transform(collection, config);

            let changed = 'changed';
            collection[0] = changed;
            let result = pipe.transform(collection, config);

            expect(result[0]).toBe(changed)

        });
    });

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
        let result1 = pipe.transform(collection, config1);
        let result2 = pipe.transform(collection, config2);

        expect(result1.length).toBe(10);
        expect(result1[0]).toBe('item 1');
        expect(result1[9]).toBe('item 10');

        expect(result2.length).toBe(50);
        expect(result2[0]).toBe('item 51');
        expect(result2[49]).toBe('item 100');
    });


    describe('server-side pagination', () => {
        let config: PaginationInstance;

        beforeEach(() => {
            config = {
                itemsPerPage: 10,
                currentPage: 1,
                totalItems: 500
            };
        });

        it('should truncate collection', () => {
            collection = collection.slice(0, 10);
            let result = pipe.transform(collection, config);

            expect(result.length).toBe(10);
            expect(result[0]).toBe('item 1');
            expect(result[9]).toBe('item 10');
        });

        it('should display page 2', () => {
            collection = collection.slice(10, 20);
            config.currentPage = 2;
            let result = pipe.transform(collection, config);

            expect(result.length).toBe(10);
            expect(result[0]).toBe('item 11');
            expect(result[9]).toBe('item 20');
        });
    });

    it('should return identical array for the same input values', () => {
        let config = {
            id: 'first_one',
            itemsPerPage: 10,
            currentPage: 1
        };
        let result1 = pipe.transform(collection, config);
        let result2 = pipe.transform(collection, config);

        expect(result1 === result2).toBe(true);
    });

    describe('unexpected input:', () => {

        it('should pass through non-array inputs', () => {
            let input;

            input = '';
            expect(pipe.transform(<any>input, { itemsPerPage: 10 })).toBe(input, 'string');

            input = 1;
            expect(pipe.transform(<any>input, { itemsPerPage: 10 })).toBe(input, 'number');

            input = {};
            expect(pipe.transform(<any>input, { itemsPerPage: 10 })).toBe(input, 'object');

            input = null;
            expect(pipe.transform(<any>input, { itemsPerPage: 10 })).toBe(input, 'null');

            input = undefined;
            expect(pipe.transform(<any>input, { itemsPerPage: 10 })).toBe(input, 'undefined');
        });

        it('should work with a string as itemsPerPage arg', function() {
            let result = pipe.transform(collection, { itemsPerPage: '10', currentPage: 2});
            expect(result.length).toBe(10);
            expect(result[0]).toBe('item 11');
            expect(result[9]).toBe('item 20');
        });

        it('should work with a string as currentPage arg', function() {
            let result = pipe.transform(collection, { itemsPerPage: 10, currentPage: '2'});
            expect(result.length).toBe(10);
            expect(result[0]).toBe('item 11');
            expect(result[9]).toBe('item 20');
        });

        it('should work with itemsPerPage and currentPage as accessors', () => {
            class Config {
                get itemsPerPage(): number { return 1; }
                set itemsPerPage(val: number) {}
                get currentPage(): number { return 1; }
                set currentPage(val: number) { }
            }
            const config = new Config();

            expect(() => pipe.transform(collection, config)).not.toThrow();
        });

    });

    describe('DOM tests:', () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [PaginationControlsComponent, PaginationControlsDirective, ComponentTestComponent, PaginatePipe],
                providers: [PaginationService],
            });
        });

        beforeEach(async(() => {
            TestBed.compileComponents();
        }));

        it('should display the correct number of items per page (10)', async(() => {
            let fixture = TestBed.createComponent(ComponentTestComponent);
            fixture.detectChanges();

            expect(getListItems(fixture).length).toBe(10);
        }));

        it('should display the correct number of items per page (50)', async(() => {
            let fixture = TestBed.createComponent(ComponentTestComponent);
            let instance: ComponentTestComponent = fixture.componentInstance;
            instance.config.itemsPerPage = 50;
            fixture.detectChanges();

            expect(getListItems(fixture).length).toBe(50);
        }));

        it('should display the correct number of items, after itemsPerPage & currentPage change', async(() => {
            let fixture = TestBed.createComponent(ComponentTestComponent);
            let instance: ComponentTestComponent = fixture.componentInstance;
            instance.config.itemsPerPage = 10;
            fixture.detectChanges();

            expect(getListItems(fixture).length).toBe(10);

            let expected = ['item 4', 'item 5', 'item 6'];
            instance.config.itemsPerPage = 3;
            instance.config.currentPage = 2;
            fixture.detectChanges();

            expect(getListItemsText(fixture)).toEqual(expected);
            expect(getListItems(fixture).length).toBe(3);
        }));

        it('should display the correct items on init', async(() => {
            let fixture = TestBed.createComponent(ComponentTestComponent);
            let instance: ComponentTestComponent = fixture.componentInstance;
            instance.config.itemsPerPage = 3;
            fixture.detectChanges();
            let expected = ['item 1', 'item 2', 'item 3'];

            expect(getListItemsText(fixture)).toEqual(expected);
        }));

        it('should not mutate the collection', async(() => {
            let fixture = TestBed.createComponent(ComponentTestComponent);
            let instance: ComponentTestComponent = fixture.componentInstance;

            expect(instance.collection.length).toBe(100);

            instance.config.itemsPerPage = 50;
            fixture.detectChanges();

            expect(instance.collection.length).toBe(100);

            instance.config.itemsPerPage = 75;
            fixture.detectChanges();

            expect(instance.collection.length).toBe(100);
        }));

        it('should default to page 1 if currentPage not set', async(() => {
            let fixture = TestBed.createComponent(ComponentTestComponent);
            let instance: ComponentTestComponent = fixture.componentInstance;
            instance.config.itemsPerPage = 3;
            instance.config.currentPage = undefined;
            fixture.detectChanges();
            let expected = ['item 1', 'item 2', 'item 3'];

            expect(getListItemsText(fixture)).toEqual(expected);
        }));
    });

});
