var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
System.register("pagination-service", ['@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1;
    var PaginationService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            PaginationService = (function () {
                function PaginationService() {
                    this.change = new core_1.EventEmitter();
                    this.instances = {};
                    this.DEFAULT_ID = 'DEFAULT_PAGINATION_ID';
                }
                Object.defineProperty(PaginationService.prototype, "defaultId", {
                    get: function () { return this.DEFAULT_ID; },
                    enumerable: true,
                    configurable: true
                });
                PaginationService.prototype.register = function (instance) {
                    if (!instance.id) {
                        instance.id = this.DEFAULT_ID;
                    }
                    if (!this.instances[instance.id]) {
                        this.instances[instance.id] = instance;
                        this.change.emit(instance.id);
                    }
                    else {
                        var changed = this.updateInstance(instance);
                        if (changed) {
                            this.change.emit(instance.id);
                        }
                    }
                };
                /**
                 * Check each property of the instance and update any that have changed. Return
                 * true if any changes were made, else return false.
                 */
                PaginationService.prototype.updateInstance = function (instance) {
                    var changed = false;
                    for (var prop in this.instances[instance.id]) {
                        if (instance[prop] !== this.instances[instance.id][prop]) {
                            this.instances[instance.id][prop] = instance[prop];
                            changed = true;
                        }
                    }
                    return changed;
                };
                /**
                 * Returns the current page number.
                 */
                PaginationService.prototype.getCurrentPage = function (id) {
                    if (this.instances[id]) {
                        return this.instances[id].currentPage;
                    }
                };
                /**
                 * Sets the current page number.
                 */
                PaginationService.prototype.setCurrentPage = function (id, page) {
                    if (this.instances[id]) {
                        var instance = this.instances[id];
                        var maxPage = Math.ceil(instance.totalItems / instance.itemsPerPage);
                        if (page <= maxPage && 1 <= page) {
                            this.instances[id].currentPage = page;
                            this.change.emit(id);
                        }
                    }
                };
                /**
                 * Sets the value of instance.totalItems
                 */
                PaginationService.prototype.setTotalItems = function (id, totalItems) {
                    if (this.instances[id] && 0 <= totalItems) {
                        this.instances[id].totalItems = totalItems;
                        this.change.emit(id);
                    }
                };
                /**
                 * Sets the value of instance.itemsPerPage.
                 */
                PaginationService.prototype.setItemsPerPage = function (id, itemsPerPage) {
                    if (this.instances[id]) {
                        this.instances[id].itemsPerPage = itemsPerPage;
                        this.change.emit(id);
                    }
                };
                /**
                 * Returns a clone of the pagination instance object matching the id. If no
                 * id specified, returns the instance corresponding to the default id.
                 */
                PaginationService.prototype.getInstance = function (id) {
                    if (id === void 0) { id = this.DEFAULT_ID; }
                    if (this.instances[id]) {
                        return this.clone(this.instances[id]);
                    }
                    return {};
                };
                /**
                 * Perform a shallow clone of an object.
                 */
                PaginationService.prototype.clone = function (obj) {
                    var target = {};
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            target[i] = obj[i];
                        }
                    }
                    return target;
                };
                return PaginationService;
            }());
            exports_1("PaginationService", PaginationService);
        }
    }
});
System.register("paginate-pipe", ["@angular/core", "pagination-service"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var core_2, pagination_service_1;
    var LARGE_NUMBER, PaginatePipe;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (pagination_service_1_1) {
                pagination_service_1 = pagination_service_1_1;
            }],
        execute: function() {
            LARGE_NUMBER = Number.MAX_SAFE_INTEGER;
            PaginatePipe = (function () {
                function PaginatePipe(service) {
                    this.service = service;
                    // store the values from the last time the pipe was invoked
                    this.state = {};
                }
                PaginatePipe.prototype.transform = function (collection, args) {
                    // When an observable is passed through the AsyncPipe, it will output
                    // `null` until the subscription resolves. In this case, we want to
                    // use the cached data from the `state` object to prevent the NgFor
                    // from flashing empty until the real values arrive.
                    if (args instanceof Array) {
                        // compatible with angular2 before beta16
                        args = args[0];
                    }
                    if (!(collection instanceof Array)) {
                        var _id = args.id || this.service.defaultId;
                        if (this.state[_id]) {
                            return this.state[_id].slice;
                        }
                        else {
                            return collection;
                        }
                    }
                    var serverSideMode = args.totalItems !== undefined;
                    var instance = this.createInstance(collection, args);
                    var id = instance.id;
                    var start, end;
                    var perPage = instance.itemsPerPage;
                    this.service.register(instance);
                    if (!serverSideMode && collection instanceof Array) {
                        perPage = perPage || LARGE_NUMBER;
                        start = (instance.currentPage - 1) * perPage;
                        end = start + perPage;
                        var isIdentical = this.stateIsIdentical(id, collection, start, end);
                        if (isIdentical) {
                            return this.state[id].slice;
                        }
                        else {
                            var slice = collection.slice(start, end);
                            this.saveState(id, collection, slice, start, end);
                            this.service.change.emit(id);
                            return slice;
                        }
                    }
                    // save the state for server-side collection to avoid null
                    // flash as new data loads.
                    this.saveState(id, collection, collection, start, end);
                    return collection;
                };
                /**
                 * Create an IPaginationInstance object, using defaults for any optional properties not supplied.
                 */
                PaginatePipe.prototype.createInstance = function (collection, args) {
                    var config = args;
                    this.checkConfig(config);
                    return {
                        id: config.id || this.service.defaultId,
                        itemsPerPage: config.itemsPerPage || 0,
                        currentPage: config.currentPage || 1,
                        totalItems: config.totalItems || collection.length
                    };
                };
                /**
                 * Ensure the argument passed to the filter contains the required properties.
                 */
                PaginatePipe.prototype.checkConfig = function (config) {
                    var required = ['itemsPerPage', 'currentPage'];
                    var missing = required.filter(function (prop) { return !config.hasOwnProperty(prop); });
                    if (0 < missing.length) {
                        throw new Error("PaginatePipe: Argument is missing the following required properties: " + missing.join(', '));
                    }
                };
                /**
                 * To avoid returning a brand new array each time the pipe is run, we store the state of the sliced
                 * array for a given id. This means that the next time the pipe is run on this collection & id, we just
                 * need to check that the collection, start and end points are all identical, and if so, return the
                 * last sliced array.
                 */
                PaginatePipe.prototype.saveState = function (id, collection, slice, start, end) {
                    this.state[id] = {
                        collection: collection,
                        size: collection.length,
                        slice: slice,
                        start: start,
                        end: end
                    };
                };
                /**
                 * For a given id, returns true if the collection, size, start and end values are identical.
                 */
                PaginatePipe.prototype.stateIsIdentical = function (id, collection, start, end) {
                    var state = this.state[id];
                    if (!state) {
                        return false;
                    }
                    var isMetaDataIdentical = state.size === collection.length &&
                        state.start === start &&
                        state.end === end;
                    if (!isMetaDataIdentical) {
                        return false;
                    }
                    return state.slice.every(function (element, index) { return element === collection[start + index]; });
                };
                PaginatePipe = __decorate([
                    core_2.Pipe({
                        name: 'paginate',
                        pure: false
                    }), 
                    __metadata('design:paramtypes', [pagination_service_1.PaginationService])
                ], PaginatePipe);
                return PaginatePipe;
            }());
            exports_2("PaginatePipe", PaginatePipe);
        }
    }
});
/**
 * The default template and styles for the pagination links are borrowed directly
 * from Zurb Foundation 6: http://foundation.zurb.com/sites/docs/pagination.html
 */
System.register("template", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var DEFAULT_TEMPLATE, DEFAULT_STYLES;
    return {
        setters:[],
        execute: function() {
            exports_3("DEFAULT_TEMPLATE", DEFAULT_TEMPLATE = "\n    <div #template>\n        <ng-content></ng-content>\n    </div>\n    <ul class=\"ng2-pagination\" \n        role=\"navigation\" \n        aria-label=\"Pagination\" \n        *ngIf=\"!hasTemplate && !(autoHide && pages.length <= 1)\">\n\n        <li class=\"pagination-previous\" [class.disabled]=\"isFirstPage()\" *ngIf=\"directionLinks\"> \n            <a *ngIf=\"1 < getCurrent()\" (click)=\"previous()\" aria-label=\"Next page\">\n                Previous <span class=\"show-for-sr\">page</span>\n            </a>\n            <span *ngIf=\"isFirstPage()\">Previous <span class=\"show-for-sr\">page</span></span>\n        </li>\n\n        <li [class.current]=\"getCurrent() === page.value\" *ngFor=\"let page of pages\">\n            <a (click)=\"setCurrent(page.value)\" *ngIf=\"getCurrent() !== page.value\">\n                <span class=\"show-for-sr\">Page</span>\n                <span>{{ page.label }}</span>\n            </a>\n            <div *ngIf=\"getCurrent() === page.value\">\n                <span class=\"show-for-sr\">You're on page</span>\n                <span>{{ page.label }}</span> \n            </div>\n        </li>\n\n        <li class=\"pagination-next\" [class.disabled]=\"isLastPage()\" *ngIf=\"directionLinks\">\n            <a *ngIf=\"!isLastPage()\" (click)=\"next()\" aria-label=\"Next page\">\n                Next <span class=\"show-for-sr\">page</span>\n            </a>\n            <span *ngIf=\"isLastPage()\">Next <span class=\"show-for-sr\">page</span></span>\n        </li>\n\n    </ul>\n    ");
            exports_3("DEFAULT_STYLES", DEFAULT_STYLES = "\n.ng2-pagination {\n  margin-left: 0;\n  margin-bottom: 1rem; }\n  .ng2-pagination::before, .ng2-pagination::after {\n    content: ' ';\n    display: table; }\n  .ng2-pagination::after {\n    clear: both; }\n  .ng2-pagination li {\n    -moz-user-select: none;\n    -webkit-user-select: none;\n    -ms-user-select: none;\n    font-size: 0.875rem;\n    margin-right: 0.0625rem;\n    border-radius: 0; }\n  .ng2-pagination li {\n    display: inline-block; }\n  .ng2-pagination a,\n  .ng2-pagination button {\n    color: #0a0a0a; \n    display: block;\n    padding: 0.1875rem 0.625rem;\n    border-radius: 0; }\n    .ng2-pagination a:hover,\n    .ng2-pagination button:hover {\n      background: #e6e6e6; }\n  .ng2-pagination .current {\n    padding: 0.1875rem 0.625rem;\n    background: #2199e8;\n    color: #fefefe;\n    cursor: default; }\n  .ng2-pagination .disabled {\n    padding: 0.1875rem 0.625rem;\n    color: #cacaca;\n    cursor: default; } \n    .ng2-pagination .disabled:hover {\n      background: transparent; }\n  .ng2-pagination .ellipsis::after {\n    content: '\u2026';\n    padding: 0.1875rem 0.625rem;\n    color: #0a0a0a; }\n\n.ng2-pagination .pagination-previous a::before,\n.ng2-pagination .pagination-previous.disabled::before { \n  content: '\u00AB';\n  display: inline-block;\n  margin-right: 0.5rem; }\n\n.ng2-pagination .pagination-next a::after,\n.ng2-pagination .pagination-next.disabled::after {\n  content: '\u00BB';\n  display: inline-block;\n  margin-left: 0.5rem; }\n\n.ng2-pagination .show-for-sr {\n  position: absolute !important;\n  width: 1px;\n  height: 1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0); }");
        }
    }
});
System.register("pagination-controls-cmp", ['@angular/core', "pagination-service", "template"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_3, pagination_service_2, template_1;
    var PaginationControlsCmp;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            },
            function (pagination_service_2_1) {
                pagination_service_2 = pagination_service_2_1;
            },
            function (template_1_1) {
                template_1 = template_1_1;
            }],
        execute: function() {
            PaginationControlsCmp = (function () {
                function PaginationControlsCmp(service, changeDetectorRef) {
                    var _this = this;
                    this.service = service;
                    this.changeDetectorRef = changeDetectorRef;
                    this.maxSize = 7;
                    this.pageChange = new core_3.EventEmitter();
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
                PaginationControlsCmp.prototype.ngOnChanges = function () {
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
                    var inst = this.service.getInstance(this.id);
                    this.pages = this.createPageArray(inst.currentPage, inst.itemsPerPage, inst.totalItems, this.maxSize);
                    var correctedCurrentPage = this.outOfBoundCorrection(inst);
                    if (correctedCurrentPage !== inst.currentPage) {
                        this.setCurrent(correctedCurrentPage);
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
                __decorate([
                    core_3.Input(), 
                    __metadata('design:type', String)
                ], PaginationControlsCmp.prototype, "id", void 0);
                __decorate([
                    core_3.Input(), 
                    __metadata('design:type', Number)
                ], PaginationControlsCmp.prototype, "maxSize", void 0);
                __decorate([
                    core_3.Input(), 
                    __metadata('design:type', Boolean)
                ], PaginationControlsCmp.prototype, "directionLinks", null);
                __decorate([
                    core_3.Input(), 
                    __metadata('design:type', Boolean)
                ], PaginationControlsCmp.prototype, "autoHide", null);
                __decorate([
                    core_3.Output(), 
                    __metadata('design:type', core_3.EventEmitter)
                ], PaginationControlsCmp.prototype, "pageChange", void 0);
                __decorate([
                    core_3.ViewChild('template'), 
                    __metadata('design:type', Object)
                ], PaginationControlsCmp.prototype, "template", void 0);
                PaginationControlsCmp = __decorate([
                    core_3.Component({
                        selector: 'pagination-controls',
                        template: template_1.DEFAULT_TEMPLATE,
                        styles: [template_1.DEFAULT_STYLES],
                        changeDetection: core_3.ChangeDetectionStrategy.OnPush
                    }), 
                    __metadata('design:paramtypes', [pagination_service_2.PaginationService, core_3.ChangeDetectorRef])
                ], PaginationControlsCmp);
                return PaginationControlsCmp;
            }());
            exports_4("PaginationControlsCmp", PaginationControlsCmp);
        }
    }
});
System.register("ng2-pagination", ["paginate-pipe", "pagination-service", "pagination-controls-cmp"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    return {
        setters:[
            function (paginate_pipe_1_1) {
                exports_5({
                    "PaginatePipe": paginate_pipe_1_1["PaginatePipe"]
                });
            },
            function (pagination_service_3_1) {
                exports_5({
                    "PaginationService": pagination_service_3_1["PaginationService"],
                    "IPaginationInstance": pagination_service_3_1["IPaginationInstance"]
                });
            },
            function (pagination_controls_cmp_1_1) {
                exports_5({
                    "PaginationControlsCmp": pagination_controls_cmp_1_1["PaginationControlsCmp"]
                });
            }],
        execute: function() {
        }
    }
});
