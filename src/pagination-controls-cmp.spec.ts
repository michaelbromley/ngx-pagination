import {Component, DebugElement} from 'angular2/core';
import {By} from 'angular2/platform/browser';
import {
    ComponentFixture,
    describe,
    expect,
    fakeAsync,
    injectAsync,
    it,
    tick,
    TestComponentBuilder
} from 'angular2/testing';
import {PaginatePipe, PaginationService} from './ng2-pagination';
import {PaginationControlsCmp} from './pagination-controls-cmp';
import {getListItems, getListItemsText, getPageLinkItems, TestCmp} from './testing-helpers';
import {} from '../dist/pagination-controls-cmp';


describe('PaginationControlsCmp:', () => {

    it('should display the correct page links (simple)',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 30;
                    expected = ['1', '2', '3', '4'];
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture)).toEqual(expected);
                });
        }));

    it('should display the correct page links (end ellipsis)',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 10;
                    let expected = ['1', '2', '3', '4', '5', '6', '7', '...', '10'];
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture)).toEqual(expected);
                });
        }));

    it('should display the correct page links (start ellipsis)',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 10;
                    instance.config.currentPage = 10;
                    let expected = ['1', '...', '4', '5', '6', '7', '8', '9', '10'];
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture)).toEqual(expected);
                });
        }));

    it('should display the correct page links (double ellipsis)',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 1;
                    instance.config.currentPage = 50;
                    let expected = ['1', '...', '48', '49', '50', '51', '52', '...', '100'];
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture)).toEqual(expected);
                });
        }));

    it('should update links when collection size changes',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    let expected = ['1', '2', '3', '4', '5', '6', '7', '...', '10'];
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture)).toEqual(expected);

                    instance.collection.push('item 101');
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    expected = ['1', '2', '3', '4', '5', '6', '7', '...', '11'];
                    expect(getPageLinkItems(fixture)).toEqual(expected);
                });
        })));

    it('should update the currently-active page when currentPage changes',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    let controlsInstance: PaginationControlsCmp = fixture
                        .debugElement.query(By.css('pagination-controls')).componentInstance;
                    fixture.detectChanges();

                    expect(controlsInstance.getCurrent()).toBe(1);

                    instance.config.currentPage = 2;
                    fixture.detectChanges();

                    expect(controlsInstance.getCurrent()).toBe(2);
                });
        }));

    it('should update the currently-active page when currentPage becomes invalid (too high)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    let controlsInstance: PaginationControlsCmp = fixture
                        .debugElement.query(By.css('pagination-controls')).componentInstance;
                    spyOn(instance, 'pageChanged');

                    instance.collection.push('item 101');
                    instance.config.currentPage = 11;
                    fixture.detectChanges();

                    expect(controlsInstance.getCurrent()).toBe(11);

                    instance.collection.pop();
                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();
                    tick();

                    expect(instance.pageChanged).toHaveBeenCalledWith(10);
                });
        })));

});
