import {By} from '@angular/platform-browser';
import {TestBed, fakeAsync, tick, ComponentFixture} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {PaginationControlsComponent} from './pagination-controls.component';
import {getPageLinkItems, ComponentTestComponent, overrideTemplate, getControlsDirective} from './testing/testing-helpers';
import {PaginationService} from './pagination.service';
import {PaginatePipe} from './paginate.pipe';
import {PaginationControlsDirective} from './pagination-controls.directive';

describe('PaginationControlsComponent:', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PaginationControlsComponent, PaginationControlsDirective, ComponentTestComponent, PaginatePipe],
            providers: [PaginationService],
        });
    });

    it('should display the correct page links (simple)', fakeAsync(() => {
        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance = fixture.componentInstance;
        instance.config.itemsPerPage = 30;
        fixture.detectChanges();

        let expected = ['1', '2', '3', '4'];

        expect(getPageLinkItems(fixture)).toEqual(expected);
    }));

    it('should display the correct page links (end ellipsis)', fakeAsync(() => {
        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance = fixture.componentInstance;
        instance.config.itemsPerPage = 10;
        fixture.detectChanges();

        let expected = ['1', '2', '3', '4', '5', '6', '7', '...', '10'];

        expect(getPageLinkItems(fixture)).toEqual(expected);
    }));

    it('should display the correct page links (start ellipsis)', fakeAsync(() => {
        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance: ComponentTestComponent = fixture.componentInstance;
        instance.config.itemsPerPage = 10;
        instance.config.currentPage = 10;
        fixture.detectChanges();

        let expected = ['1', '...', '4', '5', '6', '7', '8', '9', '10'];

        expect(getPageLinkItems(fixture)).toEqual(expected);
    }));

    it('should display the correct page links (double ellipsis)', fakeAsync(() => {
        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance: ComponentTestComponent = fixture.componentInstance;
        instance.config.itemsPerPage = 1;
        instance.config.currentPage = 50;
        fixture.detectChanges();

        let expected = ['1', '...', '48', '49', '50', '51', '52', '...', '100'];

        expect(getPageLinkItems(fixture)).toEqual(expected);
    }));

    it('should update links when collection size changes', fakeAsync(() => {
        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance: ComponentTestComponent = fixture.componentInstance;
        let expected = ['1', '2', '3', '4', '5', '6', '7', '...', '10'];
        fixture.detectChanges();

        expect(getPageLinkItems(fixture)).toEqual(expected);

        instance.collection.push('item 101');
        fixture.detectChanges();

        expected = ['1', '2', '3', '4', '5', '6', '7', '...', '11'];
        expect(getPageLinkItems(fixture)).toEqual(expected);
    }));

    it('should update the currently-active page when currentPage changes', fakeAsync(() => {
        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance: ComponentTestComponent = fixture.componentInstance;
        let controlsDirective = getControlsDirective(fixture);
        fixture.detectChanges();

        expect(controlsDirective.getCurrent()).toBe(1);

        instance.config.currentPage = 2;
        fixture.detectChanges();

        expect(controlsDirective.getCurrent()).toBe(2);
    }));

    it('should highlight the currently-active page when currentPage is passed as a numeric string',
        fakeAsync(() => {
            let fixture = TestBed.createComponent(ComponentTestComponent);
            let instance: ComponentTestComponent = fixture.componentInstance;
            instance.config.currentPage = '2' as any;
            fixture.detectChanges();

            let current: DebugElement = fixture.debugElement.query(By.css('.current'));

            expect(current).not.toBeNull();
            expect(current.nativeElement.innerText).toContain('2');
        })
    );

    it('should update the currently-active page when currentPage becomes invalid (too high)', fakeAsync(() => {
        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance: ComponentTestComponent = fixture.componentInstance;
        let controlsDirective = getControlsDirective(fixture);
        spyOn(instance, 'pageChanged');

        instance.collection.push('item 101');
        instance.config.currentPage = 11;
        fixture.detectChanges();
        tick();

        expect(controlsDirective.getCurrent()).toBe(11);

        instance.collection.pop();
        fixture.detectChanges();
        tick();

        expect(instance.pageChanged).toHaveBeenCalledWith(10);
    }));

    it('should allow the pagination-controls to come before the PaginatePipe', () => {
        overrideTemplate(ComponentTestComponent, `
            <pagination-controls [id]="config.id"></pagination-controls>
            <ul>
                <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
            </ul>`);
        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance = fixture.componentInstance;
        let controlsDirective = getControlsDirective(fixture);
        fixture.detectChanges();

        expect(controlsDirective.getCurrent()).toBe(1);

        instance.config.currentPage = 2;
        fixture.detectChanges();

        expect(controlsDirective.getCurrent()).toBe(2);
    });

    it('should allow multiple independent instances (controller test)', () => {
        overrideTemplate(ComponentTestComponent, ` 
            <ul class="list1">
               <li *ngFor="let item of collection | paginate: {id: 'test1', itemsPerPage: 10, currentPage: p1 }" 
                   class="list-item">{{ item }}</li>
            </ul>
            <pagination-controls id="test1"></pagination-controls>
            <ul class="list2">
               <li *ngFor="let item of collection | paginate: {id: 'test2', itemsPerPage: 10, currentPage: p2 }"
                   class="list-item">{{ item }}</li>
            </ul>
            <pagination-controls id="test2"></pagination-controls>`);

        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance = fixture.componentInstance;
        (instance as any).p1 = 1;
        (instance as any).p2 = 1;

        fixture.detectChanges();

        let controls: PaginationControlsDirective[] = fixture
            .debugElement.queryAll(By.css('pagination-template'))
            .map(el => el.references['p']);

        expect(controls[0].getCurrent()).toBe(1);
        expect(controls[1].getCurrent()).toBe(1);

        (instance as any).p1 = 2;
        fixture.detectChanges();

        expect(controls[0].getCurrent()).toBe(2);
        expect(controls[1].getCurrent()).toBe(1);
    });

    it('should allow multiple independent instances (template test)', fakeAsync(() => {
        overrideTemplate(ComponentTestComponent, ` 
            <ul class="list1">
               <li *ngFor="let item of collection | paginate: {id: 'test1', itemsPerPage: 10, currentPage: p1 }" 
                   class="list-item">{{ item }}</li>
            </ul>
            <pagination-controls id="test1" (pageChange)="p1 = $event"></pagination-controls>
            <ul class="list2">
               <li *ngFor="let item of collection | paginate: {id: 'test2', itemsPerPage: 10, currentPage: p2 }"
                   class="list-item">{{ item }}</li>
            </ul>
            <pagination-controls id="test2" (pageChange)="p2 = $event"></pagination-controls>`);

        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance = fixture.componentInstance;
        (instance as any).p1 = 1;
        (instance as any).p2 = 1;

        fixture.detectChanges();

        let controls: DebugElement[] = fixture.debugElement.queryAll(By.css('pagination-template'));
        let controlsDirectives: PaginationControlsDirective[] = controls.map(el => el.references['p']);

        expect(controlsDirectives[0].getCurrent()).toBe(1);
        expect(controlsDirectives[1].getCurrent()).toBe(1);

        controls[0].nativeElement.querySelector('.pagination-next a').click();
        tick();
        fixture.detectChanges();

        expect(controlsDirectives[0].getCurrent()).toBe(2);
        expect(controlsDirectives[1].getCurrent()).toBe(1);
    }));

    it('"autoHide" should be boolean', () => {
        let fixture = TestBed.createComponent(ComponentTestComponent);
        let controlsInstance = fixture.debugElement.query(By.css('pagination-controls')).componentInstance;
        expect(controlsInstance.directionLinks).toBe(true);
    });

    it('"autoHide" should work with non-data-bound values', () => {
        overrideTemplate(ComponentTestComponent, `
            <ul>
                <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
            </ul>
            <pagination-controls autoHide="false" [id]="config.id"></pagination-controls>`);
        let fixture = TestBed.createComponent(ComponentTestComponent);
        fixture.detectChanges();
        const controlsCmp: PaginationControlsComponent = fixture.debugElement
            .query(By.css('pagination-controls')).componentInstance;

        expect(controlsCmp.autoHide).toBe(false);
    });

    it('"autoHide" state should be reflected in default template', () => {
        let fixture = TestBed.createComponent(ComponentTestComponent);
        let instance = fixture.componentInstance;
        instance.config.itemsPerPage = 100;
        fixture.detectChanges();

        expect(getPageLinkItems(fixture).length).toBe(0);

        instance.autoHide = false;
        fixture.detectChanges();

        expect(getPageLinkItems(fixture).length).toBe(1);
    });

    it('"directionLinks" should work with non-data-bound values', () => {
        overrideTemplate(ComponentTestComponent, `
            <ul>
                <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
            </ul>
            <pagination-controls directionLinks="false" [id]="config.id"></pagination-controls>`);
        let fixture = TestBed.createComponent(ComponentTestComponent);
        fixture.detectChanges();
        const controlsCmp: PaginationControlsComponent = fixture.debugElement
            .query(By.css('pagination-controls')).componentInstance;

        expect(controlsCmp.directionLinks).toBe(false);
    });

    it('"directionLinks" state should be reflected in default template', fakeAsync(() => {
        let fixture = TestBed.createComponent(ComponentTestComponent);
        fixture.detectChanges();

        let instance = fixture.componentInstance;
        let items;
        items = getPageLinkItems(fixture, 'pagination-controls li', true);
        expect(items[0]).toContain('Previous');
        expect(items[items.length - 1]).toContain('Next');

        instance.directionLinks = false;
        fixture.detectChanges();
        items = getPageLinkItems(fixture, 'pagination-controls li', true);
        expect(items[0]).toContain('1');
        expect(items[items.length - 1]).toContain('10');
    }));

    describe('custom labels', () => {

        const TEST_LABEL = 'pqowieur';

        it('previousLabel should bind in correct locations', fakeAsync(() => {
            overrideTemplate(ComponentTestComponent, `
                   <ul>
                       <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
                   </ul>
                   <pagination-controls previousLabel="${TEST_LABEL}" id="test"></pagination-controls>`);
            let fixture = TestBed.createComponent(ComponentTestComponent);
            let instance = fixture.componentInstance;
            const expected = `${TEST_LABEL} page`;
            fixture.detectChanges();

            let prevSpan = fixture.debugElement.query(By.css('.pagination-previous > span')).nativeElement;
            expect(prevSpan.innerText).toContain(expected);

            instance.config.currentPage = 2;
            fixture.detectChanges();

            let prevA = fixture.debugElement.query(By.css('.pagination-previous > a')).nativeElement;
            expect(prevA.innerText).toContain(expected);
            expect(prevA.getAttribute('aria-label')).toBe(expected);
        }));

        it('nextLabel should bind in correct locations', fakeAsync(() => {
            overrideTemplate(ComponentTestComponent, `
                   <ul>
                       <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
                   </ul>
                   <pagination-controls nextLabel="${TEST_LABEL}" id="test"></pagination-controls>`);
            let fixture = TestBed.createComponent(ComponentTestComponent);
            let instance = fixture.componentInstance;
            const expected = `${TEST_LABEL} page`;
            fixture.detectChanges();

            let nextA = fixture.debugElement.query(By.css('.pagination-next > a')).nativeElement;
            expect(nextA.innerText).toContain(expected);
            expect(nextA.getAttribute('aria-label')).toBe(expected);

            instance.config.currentPage = 10;
            fixture.detectChanges();

            let nextSpan = fixture.debugElement.query(By.css('.pagination-next > span')).nativeElement;
            expect(nextSpan.innerText).toContain(expected);
        }));

        it('screenReaderPaginationLabel should bind in correct locations', fakeAsync(() => {
            overrideTemplate(ComponentTestComponent, `
                           <ul>
                               <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
                           </ul>
                           <pagination-controls screenReaderPaginationLabel="${TEST_LABEL}" id="test"></pagination-controls>`);
            let fixture = TestBed.createComponent(ComponentTestComponent);
            fixture.detectChanges();

            let paginationUl = fixture.debugElement.query(By.css('ul.ngx-pagination')).nativeElement;
            expect(paginationUl.getAttribute('aria-label')).toBe(TEST_LABEL);
        }));

        it('screenReaderPageLabel should bind in correct locations', fakeAsync(() => {
            overrideTemplate(ComponentTestComponent, `
                   <ul>
                       <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
                   </ul>
                   <pagination-controls screenReaderPageLabel="${TEST_LABEL}" id="test"></pagination-controls>`);
            let fixture = TestBed.createComponent(ComponentTestComponent);
            let instance = fixture.componentInstance;
            instance.config.currentPage = 5;

            fixture.detectChanges();

            let prevA = fixture.debugElement.query(By.css('.pagination-previous > a')).nativeElement;
            expect(prevA.innerText).toContain(`Previous ${TEST_LABEL}`);
            expect(prevA.getAttribute('aria-label')).toBe(`Previous ${TEST_LABEL}`);

            let nextA = fixture.debugElement.query(By.css('.pagination-next > a')).nativeElement;
            expect(nextA.innerText).toContain(`Next ${TEST_LABEL}`);
            expect(nextA.getAttribute('aria-label')).toBe(`Next ${TEST_LABEL}`);

            let pageA = fixture.debugElement.queryAll(By.css('.ngx-pagination li > a'))[1].nativeElement;
            expect(pageA.innerText).toContain(`${TEST_LABEL} 1`);
        }));

        it('screenReaderCurrentLabel should bind in correct locations', fakeAsync(() => {
            overrideTemplate(ComponentTestComponent, `
                   <ul>
                       <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
                   </ul>
                   <pagination-controls screenReaderCurrentLabel="${TEST_LABEL}" id="test"></pagination-controls>`);
            let fixture = TestBed.createComponent(ComponentTestComponent);

            fixture.detectChanges();

            let currentPage = fixture.debugElement.query(By.css('.ngx-pagination li.current .show-for-sr')).nativeElement;
            expect(currentPage.innerText).toContain(`${TEST_LABEL}`);
        }));

    });
});
