import {By} from '@angular/platform-browser';
import {
    async,
    describe,
    expect,
    fakeAsync,
    inject,
    it,
    tick,
} from '@angular/core/testing';
import {
  ComponentFixture,
  TestComponentBuilder
} from '@angular/compiler/testing';
import {PaginationControlsCmp} from './pagination-controls-cmp';
import {
    getPageLinkItems,
    TestCmp,
    TestCustomTemplateCmp,
    TestControlsFirstCmp
} from './testing-helpers';


describe('PaginationControlsCmp:', () => {

    it('should display the correct page links (simple)',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 30;
                    fixture.detectChanges();
                    let expected = ['1', '2', '3', '4'];

                    expect(getPageLinkItems(fixture)).toEqual(expected);
                });
        })));

    it('should display the correct page links (end ellipsis)',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 10;
                    fixture.detectChanges();
                    let expected = ['1', '2', '3', '4', '5', '6', '7', '...', '10'];

                    expect(getPageLinkItems(fixture)).toEqual(expected);
                });
        })));

    it('should display the correct page links (start ellipsis)',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 10;
                    instance.config.currentPage = 10;
                    fixture.detectChanges();
                    let expected = ['1', '...', '4', '5', '6', '7', '8', '9', '10'];

                    expect(getPageLinkItems(fixture)).toEqual(expected);
                });
        })));

    it('should display the correct page links (double ellipsis)',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 1;
                    instance.config.currentPage = 50;
                    fixture.detectChanges();
                    let expected = ['1', '...', '48', '49', '50', '51', '52', '...', '100'];

                    expect(getPageLinkItems(fixture)).toEqual(expected);
                });
        })));

    it('should update links when collection size changes',
        async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCmp)
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
        }))));

    it('should update the currently-active page when currentPage changes',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCmp)
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
        })));

    it('should update the currently-active page when currentPage becomes invalid (too high)',
        async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCmp)
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
        }))));

    it('should allow the pagination-controls to come before the PaginatePipe',
        async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
            tcb.createAsync(TestControlsFirstCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestControlsFirstCmp = fixture.componentInstance;
                    let controlsInstance: PaginationControlsCmp = fixture
                        .debugElement.query(By.css('pagination-controls')).componentInstance;
                    fixture.detectChanges();

                    expect(controlsInstance.getCurrent()).toBe(1);

                    instance.config.currentPage = 2;
                    fixture.detectChanges();

                    expect(controlsInstance.getCurrent()).toBe(2);
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
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.pages instanceof Array).toBe(true);
                    });
            })));

        it('"directionLinks" should be boolean',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.directionLinks).toBe(true);
                    });
            })));

        it('"directionLinks" state should be reflected in default template',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.createAsync(TestCmp)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        let instance: TestCmp = fixture.componentInstance;
                        let items;
                        items = getPageLinkItems(fixture, 'pagination-controls li', true);
                        expect(items[0]).toContain('Previous');
                        expect(items[items.length - 1]).toContain('Next');

                        instance.directionLinks = false;
                        fixture.detectChanges();
                        items = getPageLinkItems(fixture, 'pagination-controls li', true);
                        expect(items[0]).toContain('1');
                        expect(items[items.length - 1]).toContain('10');
                    });
            })));

        // TODO: enable this test once this issue is resolved: https://github.com/angular/angular/issues/8306
        xit('"directionLinks" should work with non-data-bound values',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestCmp, `
                    <ul>
                        <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
                    </ul>
                    <pagination-controls directionLinks="false"></pagination-controls>`)
                    .createAsync(TestCmp)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        expect(fixture.componentInstance.directionLinks).toBe(false);
                    });
            })));

        it('"autoHide" should be boolean',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.directionLinks).toBe(true);
                    });
            })));

        it('"autoHide" state should be reflected in default template',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.createAsync(TestCmp)
                    .then((fixture: ComponentFixture) => {
                        let instance: TestCmp = fixture.componentInstance;
                        instance.config.itemsPerPage = 100;
                        fixture.detectChanges();

                        expect(getPageLinkItems(fixture).length).toBe(0);

                        instance.autoHide = false;
                        fixture.detectChanges();

                        expect(getPageLinkItems(fixture).length).toBe(1);
                    });
            })));

        // TODO: enable this test once this issue is resolved: https://github.com/angular/angular/issues/8306
        xit('"autoHide" should work with non-data-bound values',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                tcb.overrideTemplate(TestCmp, `
                    <ul>
                        <li *ngFor="let item of collection | paginate: config" class="list-item">{{ item }}</li>
                    </ul>
                    <pagination-controls autoHide="false"></pagination-controls>`)
                    .createAsync(TestCmp)
                    .then((fixture: ComponentFixture) => {
                        fixture.detectChanges();
                        expect(fixture.componentInstance.directionLinks).toBe(false);
                    });
            })));

        it('"maxSize" should be a number',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.maxSize).toBe(9);
                    });
            })));

        it('"maxSize" should be a number',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.maxSize).toBe(9);
                    });
            })));

        it('"getCurrent()" should return current page',
            async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        expect(controlsInstance.getCurrent()).toBe(2);
                    });
            })));

        it('"setCurrent()" should emit pageChange event with correct value',
            async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        spyOn(testCmpInstance, 'pageChanged');
                        controlsInstance.setCurrent(3);
                        tick();

                        expect(testCmpInstance.pageChanged).toHaveBeenCalledWith(3);
                    });
            }))));

        it('"previous()" should emit pageChange event with correct value',
            async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        spyOn(testCmpInstance, 'pageChanged');
                        controlsInstance.previous();
                        tick();

                        expect(testCmpInstance.pageChanged).toHaveBeenCalledWith(1);
                    });
            }))));

        it('"next()" should emit pageChange event with correct value',
            async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        spyOn(testCmpInstance, 'pageChanged');
                        controlsInstance.next();
                        tick();

                        expect(testCmpInstance.pageChanged).toHaveBeenCalledWith(3);
                    });
            }))));

        it('"isFirstPage()" should return the correct value',
            async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        testCmpInstance.config.currentPage = 1;
                        fixture.detectChanges();
                        tick();

                        expect(controlsInstance.isFirstPage()).toBe(true);

                        testCmpInstance.config.currentPage = 2;
                        fixture.detectChanges();
                        tick();

                        expect(controlsInstance.isFirstPage()).toBe(false);
                    });
            }))));

        it('"isLastPage()" should return the correct value',
            async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
                getControlsInstance(tcb)
                    .then((controlsInstance: PaginationControlsCmp) => {
                        testCmpInstance.config.currentPage = 1;
                        fixture.detectChanges();
                        tick();

                        expect(controlsInstance.isLastPage()).toBe(false);

                        testCmpInstance.config.currentPage = 10;
                        fixture.detectChanges();
                        tick();

                        expect(controlsInstance.isLastPage()).toBe(true);
                    });
            }))));

    });

});

describe('Custom Templates:', () => {

    it('should display the correct page links (simple)',
        async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCustomTemplateCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCustomTemplateCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 30;
                    let expected = ['1', '2', '3', '4'];

                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture, 'div.page-link')).toEqual(expected);
                });
        }))));

    it('should display the correct page links (end ellipsis)',
        async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCustomTemplateCmp)
                .then((fixture: ComponentFixture) => {
                    let instance: TestCustomTemplateCmp = fixture.componentInstance;
                    instance.config.itemsPerPage = 10;
                    let expected = ['1', '2', '3', '4', '5', '...', '10'];

                    fixture.detectChanges();
                    tick();
                    fixture.detectChanges();

                    expect(getPageLinkItems(fixture, 'div.page-link')).toEqual(expected);
                });
        }))));

    it('should display the correct page links (start ellipsis)',
        async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCustomTemplateCmp)
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
        }))));

    it('should display the correct page links (double ellipsis)',
        async(inject([TestComponentBuilder], fakeAsync((tcb: TestComponentBuilder) => {
            tcb.createAsync(TestCustomTemplateCmp)
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
        }))));
});
