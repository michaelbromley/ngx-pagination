import {PaginatePipe} from "./paginate-pipe";
import {PaginationService} from "./pagination-service";

describe('paginate pipe', () => {
    let pipe: PaginatePipe;
    let collection;

    beforeEach(() => {
        let paginationService = new PaginationService();
        pipe = new PaginatePipe(paginationService);

        collection = [];
        for (let i = 0; i < 100; i++) {
            collection.push(`item ${i}`);
        }
    });

    it('should truncate collection', () => {
        let result = pipe.transform(collection, ['10']);

        expect(result.length).toBe(10);
        expect(result[0]).toBe('item 0');
        expect(result[9]).toBe('item 9');
    });
});