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
import {PaginationControlsCmp, PaginationControlsDirective} from './pagination-controls-cmp';
import {getListItems, getListItemsText, getPageLinkItems, TestCmp, TestCustomTemplateCmp} from './testing-helpers';


describe('PaginationControlsCmp:', () => {

    it('should display the correct page links (simple)',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 30;
                    fixture.detectChanges();
                    let expected = ['1', '2', '3', '4'];

                    expect(getPageLinkItems(fixture)).toEqual(expected);
                });
        }));

    it('should display the correct page links (end ellipsis)',
        injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 10;
                    fixture.detectChanges();
                    let expected = ['1', '2', '3', '4', '5', '6', '7', '...', '10'];

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
                    fixture.detectChanges();
                    let expected = ['1', '...', '4', '5', '6', '7', '8', '9', '10'];

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
                    fixture.detectChanges();
                    let expected = ['1', '...', '48', '49', '50', '51', '52', '...', '100'];

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

    describe('template api:', () => {

        let testCmpInstance: TestCmp;
        let fixture: ComponentFixture;

        function getControlsInstance(tcb: TestComponentBuilder): Promise<PaginationControlsCmp> {
            return tcb.createAsync(TestCmp)
                .then((_fixture: ComponentFixture) => {
                    fixture = _fixture;
                    testCmpInstance = _fixture.componentInstance;
                    testCmpInstance.config.currentPage = 2;
                    let controlsInstance: PaginationControlsCmp = _fixture
                        .debugElement.query(By.css('pagination-controls')).componentInstance;
                    _fixture.detectChanges();
                    return controlsInstance;
                });
        }

        it('"pages" should be an array of page objects',
            injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.api.pages instanceof Array).toBe(true);
                    });
            }));

        it('"directionLinks" should be boolean',
            injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.api.directionLinks).toBe(true);
                    });
            }));

        it('"autoHide" should be boolean',
            injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.api.directionLinks).toBe(true);
                    });
            }));

        it('"maxSize" should be a number',
            injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.api.maxSize).toBe(9);
                    });
            }));

        it('"maxSize" should be a number',
            injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.api.maxSize).toBe(9);
                    });
            }));

        it('"getCurrent()" should return current page',
            injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.api.getCurrent()).toBe(2);
                    });
            }));

        it('"setCurrent()" should emit pageChange event with correct value',
            injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        spyOn(testCmpInstance, 'pageChanged');
                        controlsInstance.api.setCurrent(3);
                        tick();

                        expect(testCmpInstance.pageChanged).toHaveBeenCalledWith(3);
                    });
            })));

        it('"previous()" should emit pageChange event with correct value',
            injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        spyOn(testCmpInstance, 'pageChanged');
                        controlsInstance.api.previous();
                        tick();

                        expect(testCmpInstance.pageChanged).toHaveBeenCalledWith(1);
                    });
            })));

        it('"next()" should emit pageChange event with correct value',
            injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        spyOn(testCmpInstance, 'pageChanged');
                        controlsInstance.api.next();
                        tick();

                        expect(testCmpInstance.pageChanged).toHaveBeenCalledWith(3);
                    });
            })));

        it('"isFirstPage()" should return the correct value',
            injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        testCmpInstance.config.currentPage = 1;
                        fixture.detectChanges();
                        tick();

                        expect(controlsInstance.api.isFirstPage()).toBe(true);

                        testCmpInstance.config.currentPage = 2;
                        fixture.detectChanges();
                        tick();

                        expect(controlsInstance.api.isFirstPage()).toBe(false);
                    });
            })));

        it('"isLastPage()" should return the correct value',
            injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                return getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        testCmpInstance.config.currentPage = 1;
                        fixture.detectChanges();
                        tick();

                        expect(controlsInstance.api.isLastPage()).toBe(false);

                        testCmpInstance.config.currentPage = 10;
                        fixture.detectChanges();
                        tick();

                        expect(controlsInstance.api.isLastPage()).toBe(true);
                    });
            })));

    });

});

describe('PaginationControlsDirective', () => {

    it('should display the correct page links (simple)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCustomTemplateCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCustomTemplateCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 30;
                    let expected = ['1', '2', '3', '4'];

                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture, 'div.page-link')).toEqual(expected);
                });
        })));

    it('should display the correct page links (end ellipsis)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCustomTemplateCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCustomTemplateCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 10;
                    let expected = ['1', '2', '3', '4', '5', '...', '10'];

                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture, 'div.page-link')).toEqual(expected);
                });
        })));

    it('should display the correct page links (start ellipsis)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCustomTemplateCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCustomTemplateCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 10;
                    instance.config.currentPage = 10;
                    let expected = ['1', '...', '6', '7', '8', '9', '10'];

                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture, 'div.page-link')).toEqual(expected);
                });
        })));

    it('should display the correct page links (double ellipsis)',
        injectAsync([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            return tcb.createAsync(TestCustomTemplateCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCustomTemplateCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 1;
                    instance.config.currentPage = 50;
                    let expected = ['1', '...', '49', '50', '51', '...', '100'];

                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture, 'div.page-link')).toEqual(expected);
                });
        })));
});
