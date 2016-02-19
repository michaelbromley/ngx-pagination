var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var lang_1 = require('angular2/src/facade/lang');
var pagination_service_1 = require("./pagination-service");
var DEFAULT_TEMPLATE = "\n    <ul class=\"pagination\" role=\"navigation\" aria-label=\"Pagination\">\n\n        <li class=\"pagination-previous\" [class.disabled]=\"isFirstPage()\" *ngIf=\"directionLinks\">\n            <a *ngIf=\"1 < getCurrent()\" (click)=\"setCurrent(getCurrent() - 1)\" aria-label=\"Next page\">\n                Previous <span class=\"show-for-sr\">page</span>\n            </a>\n            <span *ngIf=\"isFirstPage()\">Previous <span class=\"show-for-sr\">page</span></span>\n        </li>\n\n        <li [class.current]=\"getCurrent() === page.value\" *ngFor=\"#page of pages\">\n            <a (click)=\"setCurrent(page.value)\" *ngIf=\"getCurrent() !== page.value\">\n                <span class=\"show-for-sr\">Page</span>\n                <span>{{ page.label }}</span>\n            </a>\n            <div *ngIf=\"getCurrent() === page.value\">\n                <span class=\"show-for-sr\">You're on page</span>\n                <span>{{ page.label }}</span>\n            </div>\n        </li>\n\n        <li class=\"pagination-next\" [class.disabled]=\"isLastPage()\" *ngIf=\"directionLinks\">\n            <a *ngIf=\"!isLastPage()\" (click)=\"setCurrent(getCurrent() + 1)\" aria-label=\"Next page\">\n                Next <span class=\"show-for-sr\">page</span>\n            </a>\n            <span *ngIf=\"isLastPage()\">Next <span class=\"show-for-sr\">page</span></span>\n        </li>\n\n    </ul>\n    ";
var PaginationControlsBase = (function () {
    function PaginationControlsBase(service) {
        var _this = this;
        this.service = service;
        this.maxSize = 7;
        this.directionLinks = true;
        this.autoHide = false;
        this.pageChange = new core_1.EventEmitter();
        this.pages = [];
        this.changeSub = this.service.change
            .subscribe(function (id) {
            if (_this.id === id) {
                _this.updatePages();
            }
        });
    }
    PaginationControlsBase.prototype.updatePages = function () {
        var inst = this.service.getInstance(this.id);
        this.pages = this.createPageArray(inst.currentPage, inst.itemsPerPage, inst.totalItems, this.maxSize);
        var correctedCurrentPage = this.outOfBoundCorrection(inst);
        if (correctedCurrentPage !== inst.currentPage) {
            this.setCurrent(correctedCurrentPage);
        }
    };
    /**
     * Set up the subscription to the PaginationService.change observable.
     */
    PaginationControlsBase.prototype.ngOnInit = function () {
        if (this.id === undefined) {
            this.id = this.service.defaultId;
        }
    };
    PaginationControlsBase.prototype.ngOnChanges = function () {
        this.updatePages();
    };
    PaginationControlsBase.prototype.ngOnDestroy = function () {
        this.changeSub.unsubscribe();
    };
    /**
     * Set the current page number.
     */
    PaginationControlsBase.prototype.setCurrent = function (page) {
        this.pageChange.emit(page);
    };
    /**
     * Get the current page number.
     */
    PaginationControlsBase.prototype.getCurrent = function () {
        return this.service.getCurrentPage(this.id);
    };
    PaginationControlsBase.prototype.isFirstPage = function () {
        return this.getCurrent() === 1;
    };
    PaginationControlsBase.prototype.isLastPage = function () {
        var inst = this.service.getInstance(this.id);
        return Math.ceil(inst.totalItems / inst.itemsPerPage) === inst.currentPage;
    };
    /**
     * Checks that the instance.currentPage property is within bounds for the current page range.
     * If not, return a correct value for currentPage, or the current value if OK.
     */
    PaginationControlsBase.prototype.outOfBoundCorrection = function (instance) {
        var totalPages = Math.ceil(instance.totalItems / instance.itemsPerPage);
        if (totalPages < instance.currentPage) {
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
    PaginationControlsBase.prototype.createPageArray = function (currentPage, itemsPerPage, totalItems, paginationRange) {
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
    PaginationControlsBase.prototype.calculatePageNumber = function (i, currentPage, paginationRange, totalPages) {
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
    return PaginationControlsBase;
})();
var PaginationControlsDirective = (function (_super) {
    __extends(PaginationControlsDirective, _super);
    function PaginationControlsDirective(service, viewContainer, cdr) {
        _super.call(this, service);
        this.viewContainer = viewContainer;
        this.cdr = cdr;
        this.maxSize = 7;
        this.directionLinks = true;
        this.autoHide = false;
        this.api = {};
    }
    PaginationControlsDirective.prototype.ngOnInit = function () {
        this.cdr.detach();
    };
    PaginationControlsDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.api = {
            pages: [],
            directionLinks: this.directionLinks,
            autoHide: this.autoHide,
            maxSize: this.maxSize,
            getCurrent: function () { return _this.getCurrent(); },
            setCurrent: function (val) { return _this.setCurrent(val); },
            isFirstPage: function () { return _this.isFirstPage(); },
            isLastPage: function () { return _this.isLastPage(); }
        };
        if (this.customTemplate !== null) {
            this.templateView = this.viewContainer.createEmbeddedView(this.customTemplate);
            this.templateView.setLocal('paginationApi', this.api);
        }
        setTimeout(function () { return _this.cdr.reattach(); });
    };
    PaginationControlsDirective.prototype.ngAfterViewChecked = function () {
        this.api.pages = this.pages;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PaginationControlsDirective.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PaginationControlsDirective.prototype, "maxSize", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PaginationControlsDirective.prototype, "directionLinks", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PaginationControlsDirective.prototype, "autoHide", void 0);
    __decorate([
        core_1.ContentChild(core_1.TemplateRef), 
        __metadata('design:type', Object)
    ], PaginationControlsDirective.prototype, "customTemplate", void 0);
    PaginationControlsDirective = __decorate([
        core_1.Directive({
            selector: '[paginationControls]'
        }), 
        __metadata('design:paramtypes', [pagination_service_1.PaginationService, core_1.ViewContainerRef, core_1.ChangeDetectorRef])
    ], PaginationControlsDirective);
    return PaginationControlsDirective;
})(PaginationControlsBase);
exports.PaginationControlsDirective = PaginationControlsDirective;
var PaginationControlsCmp = (function (_super) {
    __extends(PaginationControlsCmp, _super);
    function PaginationControlsCmp(service) {
        _super.call(this, service);
        this.maxSize = 7;
        this.directionLinks = true;
        this.autoHide = false;
        _super.call(this, service);
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PaginationControlsCmp.prototype, "id", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PaginationControlsCmp.prototype, "maxSize", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PaginationControlsCmp.prototype, "directionLinks", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PaginationControlsCmp.prototype, "autoHide", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], PaginationControlsCmp.prototype, "pageChange", void 0);
    PaginationControlsCmp = __decorate([
        core_1.Component({
            selector: 'pagination-controls',
            template: DEFAULT_TEMPLATE
        }), 
        __metadata('design:paramtypes', [pagination_service_1.PaginationService])
    ], PaginationControlsCmp);
    return PaginationControlsCmp;
})(PaginationControlsBase);
exports.PaginationControlsCmp = PaginationControlsCmp;
exports.PAGINATION_DIRECTIVES = lang_1.CONST_EXPR([PaginationControlsDirective, PaginationControlsCmp]);
