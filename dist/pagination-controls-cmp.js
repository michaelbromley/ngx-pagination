var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var angular2_1 = require('angular2/angular2');
var pagination_service_1 = require("./pagination-service");
var PaginationControlsCmp = (function () {
    function PaginationControlsCmp(service) {
        this.service = service;
        this.pages = [];
    }
    PaginationControlsCmp.prototype.ngOnInit = function () {
        var _this = this;
        if (this.id === undefined) {
            this.id = this.service.defaultId;
        }
        this.changeSub = this.service.change
            .filter(function (id) { return _this.id === id; })
            .subscribe(function () {
            var instance = _this.service.getInstance(_this.id);
            _this.pages = _this.createPageArray(instance.currentPage, instance.itemsPerPage, instance.totalItems);
        });
    };
    PaginationControlsCmp.prototype.ngOnDestroy = function () {
        // TODO: do i need to manually clean these up??? What's the difference between unsubscribe() and remove()
        this.changeSub.unsubscribe();
    };
    PaginationControlsCmp.prototype.setCurrent = function (page) {
        this.service.setCurrentPage(this.id, page);
    };
    PaginationControlsCmp.prototype.getCurrent = function () {
        return this.service.getCurrentPage(this.id);
    };
    PaginationControlsCmp.prototype.setNext = function () {
    };
    /**
     * Returns an array of IPage objects to use in the pagination controls.
     */
    PaginationControlsCmp.prototype.createPageArray = function (currentPage, itemsPerPage, totalItems, paginationRange) {
        if (paginationRange === void 0) { paginationRange = 5; }
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
        angular2_1.Input(), 
        __metadata('design:type', String)
    ], PaginationControlsCmp.prototype, "id", void 0);
    PaginationControlsCmp = __decorate([
        angular2_1.Component({
            selector: 'kb-pagination-controls',
            template: "",
            directives: [angular2_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [pagination_service_1.PaginationService])
    ], PaginationControlsCmp);
    return PaginationControlsCmp;
})();
exports.PaginationControlsCmp = PaginationControlsCmp;
