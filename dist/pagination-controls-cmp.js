"use strict";
var core_1 = require('@angular/core');
var pagination_service_1 = require("./pagination-service");
var template_1 = require('./template');
var PaginationControlsCmp = (function () {
    function PaginationControlsCmp(service, changeDetectorRef) {
        var _this = this;
        this.service = service;
        this.changeDetectorRef = changeDetectorRef;
        this.maxSize = 7;
        this.pageChange = new core_1.EventEmitter();
        this.pages = [];
        this.hasTemplate = false;
        this._directionLinks = true;
        this._autoHide = false;
        this.changeSub = this.service.change
            .subscribe(function (id) {
            if (_this.id === id) {
                _this.updatePageLinks();
                _this.changeDetectorRef.markForCheck();
            }
        });
    }
    Object.defineProperty(PaginationControlsCmp.prototype, "directionLinks", {
        get: function () {
            return this._directionLinks;
        },
        set: function (value) {
            this._directionLinks = !!value && value !== 'false';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PaginationControlsCmp.prototype, "autoHide", {
        get: function () {
            return this._autoHide;
        },
        set: function (value) {
            this._autoHide = !!value && value !== 'false';
        },
        enumerable: true,
        configurable: true
    });
    PaginationControlsCmp.prototype.ngOnInit = function () {
        if (this.id === undefined) {
            this.id = this.service.defaultId;
        }
        this.updatePageLinks();
    };
    PaginationControlsCmp.prototype.ngOnChanges = function (changes) {
        this.updatePageLinks();
    };
    PaginationControlsCmp.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (this.template && 0 < this.template.nativeElement.children.length) {
            this.hasTemplate = true;
            setTimeout(function () { return _this.changeDetectorRef.markForCheck(); });
        }
    };
    PaginationControlsCmp.prototype.ngOnDestroy = function () {
        this.changeSub.unsubscribe();
    };
    /**
     * Go to the previous page
     */
    PaginationControlsCmp.prototype.previous = function () {
        this.setCurrent(this.getCurrent() - 1);
    };
    /**
     * Go to the next page
     */
    PaginationControlsCmp.prototype.next = function () {
        this.setCurrent(this.getCurrent() + 1);
    };
    /**
     * Returns true if current page is first page
     */
    PaginationControlsCmp.prototype.isFirstPage = function () {
        return this.getCurrent() === 1;
    };
    /**
     * Returns true if current page is last page
     */
    PaginationControlsCmp.prototype.isLastPage = function () {
        return this.getLastPage() === this.getCurrent();
    };
    /**
     * Set the current page number.
     */
    PaginationControlsCmp.prototype.setCurrent = function (page) {
        this.pageChange.emit(page);
    };
    /**
     * Get the current page number.
     */
    PaginationControlsCmp.prototype.getCurrent = function () {
        return this.service.getCurrentPage(this.id);
    };
    /**
     * Returns the last page number
     */
    PaginationControlsCmp.prototype.getLastPage = function () {
        var inst = this.service.getInstance(this.id);
        if (inst.totalItems < 1) {
            // when there are 0 or fewer (an error case) items, there are no "pages" as such,
            // but it makes sense to consider a single, empty page as the last page.
            return 1;
        }
        return Math.ceil(inst.totalItems / inst.itemsPerPage);
    };
    /**
     * Updates the page links and checks that the current page is valid. Should run whenever the
     * PaginationService.change stream emits a value matching the current ID, or when any of the
     * input values changes.
     */
    PaginationControlsCmp.prototype.updatePageLinks = function () {
        var _this = this;
        var inst = this.service.getInstance(this.id);
        var correctedCurrentPage = this.outOfBoundCorrection(inst);
        if (correctedCurrentPage !== inst.currentPage) {
            setTimeout(function () {
                _this.setCurrent(correctedCurrentPage);
                _this.pages = _this.createPageArray(inst.currentPage, inst.itemsPerPage, inst.totalItems, _this.maxSize);
            });
        }
        else {
            this.pages = this.createPageArray(inst.currentPage, inst.itemsPerPage, inst.totalItems, this.maxSize);
        }
    };
    /**
     * Checks that the instance.currentPage property is within bounds for the current page range.
     * If not, return a correct value for currentPage, or the current value if OK.
     */
    PaginationControlsCmp.prototype.outOfBoundCorrection = function (instance) {
        var totalPages = Math.ceil(instance.totalItems / instance.itemsPerPage);
        if (totalPages < instance.currentPage && 0 < totalPages) {
            return totalPages;
        }
        else if (instance.currentPage < 1) {
            return 1;
        }
        return instance.currentPage;
    };
    /**
     * Returns an array of IPage objects to use in the pagination controls.
     */
    PaginationControlsCmp.prototype.createPageArray = function (currentPage, itemsPerPage, totalItems, paginationRange) {
        // paginationRange could be a string if passed from attribute, so cast to number.
        paginationRange = +paginationRange;
        var pages = [];
        var totalPages = Math.ceil(totalItems / itemsPerPage);
        var halfWay = Math.ceil(paginationRange / 2);
        var isStart = currentPage <= halfWay;
        var isEnd = totalPages - halfWay < currentPage;
        var isMiddle = !isStart && !isEnd;
        var ellipsesNeeded = paginationRange < totalPages;
        var i = 1;
        while (i <= totalPages && i <= paginationRange) {
            var label = void 0;
            var pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);
            var openingEllipsesNeeded = (i === 2 && (isMiddle || isEnd));
            var closingEllipsesNeeded = (i === paginationRange - 1 && (isMiddle || isStart));
            if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                label = '...';
            }
            else {
                label = pageNumber;
            }
            pages.push({
                label: label,
                value: pageNumber
            });
            i++;
        }
        return pages;
    };
    /**
     * Given the position in the sequence of pagination links [i],
     * figure out what page number corresponds to that position.
     */
    PaginationControlsCmp.prototype.calculatePageNumber = function (i, currentPage, paginationRange, totalPages) {
        var halfWay = Math.ceil(paginationRange / 2);
        if (i === paginationRange) {
            return totalPages;
        }
        else if (i === 1) {
            return i;
        }
        else if (paginationRange < totalPages) {
            if (totalPages - halfWay < currentPage) {
                return totalPages - paginationRange + i;
            }
            else if (halfWay < currentPage) {
                return currentPage - halfWay + i;
            }
            else {
                return i;
            }
        }
        else {
            return i;
        }
    };
    PaginationControlsCmp.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'pagination-controls',
                    template: template_1.DEFAULT_TEMPLATE,
                    styles: [template_1.DEFAULT_STYLES],
                    changeDetection: core_1.ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    PaginationControlsCmp.ctorParameters = [
        { type: pagination_service_1.PaginationService, },
        { type: core_1.ChangeDetectorRef, },
    ];
    PaginationControlsCmp.propDecorators = {
        'id': [{ type: core_1.Input },],
        'maxSize': [{ type: core_1.Input },],
        'directionLinks': [{ type: core_1.Input },],
        'autoHide': [{ type: core_1.Input },],
        'pageChange': [{ type: core_1.Output },],
        'template': [{ type: core_1.ViewChild, args: ['template',] },],
    };
    return PaginationControlsCmp;
}());
exports.PaginationControlsCmp = PaginationControlsCmp;
