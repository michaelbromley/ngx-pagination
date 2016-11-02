import {By} from '@angular/platform-browser';
import {TestBed, fakeAsync, tick, ComponentFixture} from '@angular/core/testing';
import {DebugElement} from '@angular/core';
import {PaginationControlsComponent} from './pagination-controls.component';
import {getPageLinkItems, TestComponent, overrideTemplate} from './testing/testing-helpers';
import {PaginationService} from './pagination.service';
import {PaginatePipe} from './paginate.pipe';

describe('PaginationControlsComponent:', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PaginationControlsComponent, TestComponent, PaginatePipe],
            providers: [PaginationService],
        });
    });


    it('should display the correct page links (simple)', fakeAsync(() => {
        let fixture = TestBed.createComponent(TestComponent);
        let instance = fixture.componentInstance;
        instance.config.itemsPerPage = 30;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        let expected = ['1', '2', '3', '4'];

        expect(getPageLinkItems(fixture)).toEqual(expected);
    }));

    it('should display the correct page links (end ellipsis)', fakeAsync(() => {
        let fixture = TestBed.createComponent(TestComponent);
        let instance = fixture.componentInstance;
        instance.config.itemsPerPage = 10;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        let expected = ['1', '2', '3', '4', '5', '6', '7', '...', '10'];

        expect(getPageLinkItems(fixture)).toEqual(expected);
    }));

    it('should display the correct page links (start ellipsis)', fakeAsync(() => {
        let fixture = TestBed.createComponent(TestComponent);
        let instance: TestComponent = fixture.componentInstance;
        instance.config.itemsPerPage = 10;
        instance.config.currentPage = 10;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        let expected = ['1', '...', '4', '5', '6', '7', '8', '9', '10'];

        expect(getPageLinkItems(fixture)).toEqual(expected);
    }));

    it('should display the correct page links (double ellipsis)', fakeAsync(() => {
        let fixture = TestBed.createComponent(TestComponent);
        let instance: TestComponent = fixture.componentInstance;
        instance.config.itemsPerPage = 1;
        instance.config.currentPage = 50;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        let expected = ['1', '...', '48', '49', '50', '51', '52', '...', '100'];

        expect(getPageLinkItems(fixture)).toEqual(expected);
    }));

    it('should update links when collection size changes', fakeAsync(() => {
        let fixture = TestBed.createComponent(TestComponent);
        let instance: TestComponent = fixture.componentInstance;
        let expected = ['1', '2', '3', '4', '5', '6', '7', '...', '10'];
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(getPageLinkItems(fixture)).toEqual(expected);

        instance.collection.push('item 101');
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        expected = ['1', '2', '3', '4', '5', '6', '7', '...', '11'];
        expect(getPageLinkItems(fixture)).toEqual(expected);
    }));

    it('should update the currently-active page when currentPage changes', fakeAsync(() => {
        let fixture = TestBed.createComponent(TestComponent);
        let instance: TestComponent = fixture.componentInstance;
        let controlsInstance: PaginationControlsComponent = fixture
            .debugElement.query(By.css('pagination-controls')).componentInstance;
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        expect(controlsInstance.getCurrent()).toBe(1);

        instance.config.currentPage = 2;
        fixture.detectChanges();

        expect(controlsInstance.getCurrent()).toBe(2);
    }));

    it('should update the currently-active page when currentPage becomes invalid (too high)', fakeAsync(() => {
        let fixture = TestBed.createComponent(TestComponent);
        let instance: TestComponent = fixture.componentInstance;
        let controlsInstance: PaginationControlsComponent = fixture
            .debugElement.query(By.css('pagination-controls')).componentInstance;
        spyOn(instance, 'pageChanged');

        instance.collection.push('item 101');
        instance.config.currentPage = 11;
        fixture.detectChanges();
        tick();

        expect(controlsInstance.getCurrent()).toBe(11);

        instance.collection.pop();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        tick();

        expect(instance.pageChanged).toHaveBeenCalledWith(10);
    }));

    it('should allow the pagination-controls to come before the PaginatePipe', () => {
        overrideTemplate(TestComponent, `
            <pagination-controls [id]="config.id"></pagination-controls>
            <ul>
                <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
            </ul>`);
        let fixture = TestBed.createComponent(TestComponent);
        let instance = fixture.componentInstance;
        let controlsInstance: PaginationControlsComponent = fixture
            .debugElement.query(By.css('pagination-controls')).componentInstance;
        fixture.detectChanges();

        expect(controlsInstance.getCurrent()).toBe(1);

        instance.config.currentPage = 2;
        fixture.detectChanges();

        expect(controlsInstance.getCurrent()).toBe(2);
    });

    it('should allow multiple independent instances (controller test)', () => {
        overrideTemplate(TestComponent, ` 
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

        let fixture = TestBed.createComponent(TestComponent);
        let instance = fixture.componentInstance;
        (instance as any).p1 = 1;
        (instance as any).p2 = 1;

        fixture.detectChanges();

        let controls: PaginationControlsComponent[] = fixture
            .debugElement.queryAll(By.css('pagination-controls'))
            .map(el => el.componentInstance);

        expect(controls[0].getCurrent()).toBe(1);
        expect(controls[1].getCurrent()).toBe(1);

        (instance as any).p1 = 2;
        fixture.detectChanges();

        expect(controls[0].getCurrent()).toBe(2);
        expect(controls[1].getCurrent()).toBe(1);
    });

    it('should allow multiple independent instances (template test)', fakeAsync(() => {
        overrideTemplate(TestComponent, ` 
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

        let fixture = TestBed.createComponent(TestComponent);
        let instance = fixture.componentInstance;
        (instance as any).p1 = 1;
        (instance as any).p2 = 1;

        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        let controls: DebugElement[] = fixture.debugElement.queryAll(By.css('pagination-controls'));
        let controlsInstances: PaginationControlsComponent[] = controls.map(el => el.componentInstance);

        expect(controlsInstances[0].getCurrent()).toBe(1);
        expect(controlsInstances[1].getCurrent()).toBe(1);

        controls[0].nativeElement.querySelector('.pagination-next a').click();
        tick();
        fixture.detectChanges();

        expect(controlsInstances[0].getCurrent()).toBe(2);
        expect(controlsInstances[1].getCurrent()).toBe(1);
    }));

    it('"autoHide" should work with non-data-bound values', () => {
        overrideTemplate(TestComponent, `
            <ul>
                <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
            </ul>
            <pagination-controls autoHide="false"></pagination-controls>`);
        let fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        const controlsCmp: PaginationControlsComponent = fixture.debugElement
            .query(By.css('pagination-controls')).componentInstance;

        expect(controlsCmp.autoHide).toBe(false);
    });

    it('"directionLinks" should work with non-data-bound values', () => {
        overrideTemplate(TestComponent, `
            <ul>
                <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
            </ul>
            <pagination-controls directionLinks="false"></pagination-controls>`);
        let fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        const controlsCmp: PaginationControlsComponent = fixture.debugElement
            .query(By.css('pagination-controls')).componentInstance;

        expect(controlsCmp.directionLinks).toBe(false);
    });

    describe('template api', () => {

        function getControlsInstance(fixture: ComponentFixture<TestComponent>): PaginationControlsComponent {
            let testCmpInstance = fixture.componentInstance;
            testCmpInstance.config.currentPage = 2;
            let controlsInstance: PaginationControlsComponent = fixture
                .debugElement.query(By.css('pagination-controls')).componentInstance;
            fixture.detectChanges();
            return controlsInstance;
        }

        it('"pages" should be an array of page objects', () => {
            let fixture = TestBed.createComponent(TestComponent);
            let controlsInstance = getControlsInstance(fixture);
            expect(controlsInstance.pages instanceof Array).toBe(true);
        });

        it('"directionLinks" should be boolean', () => {
            let fixture = TestBed.createComponent(TestComponent);
            let controlsInstance = getControlsInstance(fixture);
            expect(controlsInstance.directionLinks).toBe(true);
        });

        it('"directionLinks" state should be reflected in default template', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            let instance: TestComponent = fixture.componentInstance;
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

        it('"autoHide" should be boolean', () => {
            let fixture = TestBed.createComponent(TestComponent);
            let controlsInstance = getControlsInstance(fixture);
            expect(controlsInstance.directionLinks).toBe(true);
        });

        it('"autoHide" state should be reflected in default template', () => {
            let fixture = TestBed.createComponent(TestComponent);
            let instance: TestComponent = fixture.componentInstance;
            instance.config.itemsPerPage = 100;
            fixture.detectChanges();

            expect(getPageLinkItems(fixture).length).toBe(0);

            instance.autoHide = false;
            fixture.detectChanges();

            expect(getPageLinkItems(fixture).length).toBe(1);
        });

        it('"maxSize" should be a number', () => {
            let fixture = TestBed.createComponent(TestComponent);
            let controlsInstance = getControlsInstance(fixture);
            expect(controlsInstance.maxSize).toBe(9);
        });

        it('"maxSize" should be a number', () => {
            let fixture = TestBed.createComponent(TestComponent);
            let controlsInstance = getControlsInstance(fixture);
            expect(controlsInstance.maxSize).toBe(9);
        });

        it('"getCurrent()" should return current page', () => {
            let fixture = TestBed.createComponent(TestComponent);
            let controlsInstance = getControlsInstance(fixture);
            expect(controlsInstance.getCurrent()).toBe(2);
        });

        it('"setCurrent()" should emit pageChange event with correct value', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let testCmpInstance = fixture.componentInstance;
            let controlsInstance = getControlsInstance(fixture);
            spyOn(testCmpInstance, 'pageChanged');
            controlsInstance.setCurrent(3);
            tick();

            expect(testCmpInstance.pageChanged).toHaveBeenCalledWith(3);
        }));

        it('"previous()" should emit pageChange event with correct value', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let testCmpInstance = fixture.componentInstance;
            let controlsInstance = getControlsInstance(fixture);
            spyOn(testCmpInstance, 'pageChanged');
            controlsInstance.previous();
            tick();

            expect(testCmpInstance.pageChanged).toHaveBeenCalledWith(1);
        }));

        it('"next()" should emit pageChange event with correct value', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let testCmpInstance = fixture.componentInstance;
            let controlsInstance = getControlsInstance(fixture);
            spyOn(testCmpInstance, 'pageChanged');
            controlsInstance.next();
            tick();

            expect(testCmpInstance.pageChanged).toHaveBeenCalledWith(3);
        }));

        it('"isFirstPage()" should return the correct value', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let testCmpInstance = fixture.componentInstance;
            let controlsInstance = getControlsInstance(fixture);
            testCmpInstance.config.currentPage = 1;
            fixture.detectChanges();
            tick();

            expect(controlsInstance.isFirstPage()).toBe(true);

            testCmpInstance.config.currentPage = 2;
            fixture.detectChanges();
            tick();

            expect(controlsInstance.isFirstPage()).toBe(false);
        }));

        it('"isLastPage()" should return the correct value', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let testCmpInstance = fixture.componentInstance;
            let controlsInstance = getControlsInstance(fixture);
            testCmpInstance.config.currentPage = 1;
            fixture.detectChanges();
            tick();

            expect(controlsInstance.isLastPage()).toBe(false);

            testCmpInstance.config.currentPage = 10;
            fixture.detectChanges();
            tick();

            expect(controlsInstance.isLastPage()).toBe(true);
        }));

    });

    describe('custom templates', () => {

        beforeEach(() => {
            overrideTemplate(TestComponent, `
                <ul>
                     <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
                </ul>
                <pagination-controls #p [id]="config.id" (pageChange)="config.currentPage = $event">
                     <div #template class="custom-template">
                         <div class="pagination-previous" [class.disabled]="p.isFirstPage()" *ngIf="p.directionLinks">
                             <span *ngIf="!p.isFirstPage()" (click)="p.previous()">back</span>
                         </div>
                
                         <div class="page-link" [class.current]="p.getCurrent() === page.value" *ngFor="let page of p.pages">
                             <span (click)="p.setCurrent(page.value)">{{ page.label }}</span>
                         </div>
                
                         <div class="pagination-next" [class.disabled]="p.isLastPage()" *ngIf="p.directionLinks">
                             <span *ngIf="!p.isLastPage()" (click)="p.next()">forward</span>
                         </div>
                     </div>
                </pagination-controls>`);
        });

        it('should not flash the default template before the first tick', () => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            let defaultTemplate = fixture.debugElement.query(By.css('.ng2-pagination'));

            expect(defaultTemplate).toBeNull();
        });

        it('should not display the default template', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            fixture.detectChanges();
            tick();
            fixture.detectChanges();
            let defaultTemplate = fixture.debugElement.query(By.css('.ng2-pagination'));

            expect(defaultTemplate).toBeNull();
        }));

        it('should display the correct page links (simple)', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let instance = fixture.componentInstance;
            instance.config.itemsPerPage = 30;
            let expected = ['1', '2', '3', '4'];

            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            expect(getPageLinkItems(fixture, 'div.page-link')).toEqual(expected);
        }));

        it('should display the correct page links (end ellipsis)', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let instance = fixture.componentInstance;
            instance.config.itemsPerPage = 10;
            let expected = ['1', '2', '3', '4', '5', '...', '10'];

            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            expect(getPageLinkItems(fixture, 'div.page-link')).toEqual(expected);
        }));

        it('should display the correct page links (start ellipsis)', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let instance = fixture.componentInstance;
            instance.config.itemsPerPage = 10;
            instance.config.currentPage = 10;
            let expected = ['1', '...', '6', '7', '8', '9', '10'];

            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            expect(getPageLinkItems(fixture, 'div.page-link')).toEqual(expected);
        }));

        it('should display the correct page links (double ellipsis)', fakeAsync(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let instance = fixture.componentInstance;
            instance.config.itemsPerPage = 1;
            instance.config.currentPage = 50;
            let expected = ['1', '...', '49', '50', '51', '...', '100'];

            fixture.detectChanges();
            tick();
            fixture.detectChanges();

            expect(getPageLinkItems(fixture, 'div.page-link')).toEqual(expected);
        }));
    });
});
