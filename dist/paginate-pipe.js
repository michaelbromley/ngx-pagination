var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("angular2/core");
var pagination_service_1 = require("./pagination-service");
var PaginatePipe = (function () {
    function PaginatePipe(service) {
        this.service = service;
    }
    PaginatePipe.prototype.transform = function (collection, args) {
        var itemsPerPage = parseInt(args[0]);
        var id = args[1] || this.service.defaultId;
        var start, end;
        var instance = this.service.getInstance(id);
        if (!instance) {
            this.service.register({
                id: id,
                itemsPerPage: itemsPerPage,
                currentPage: 1,
                totalItems: collection.length
            });
        }
        else if (instance.totalItems !== collection.length) {
            this.service.setTotalItems(id, collection.length);
        }
        console.log('pagination pipe');
        if (collection instanceof Array) {
            itemsPerPage = itemsPerPage || 9999999999;
            start = (this.service.getCurrentPage(id) - 1) * itemsPerPage;
            end = start + itemsPerPage;
            return collection.slice(start, end);
        }
        return collection;
    };
    PaginatePipe = __decorate([
        core_1.Pipe({
            name: 'paginate',
            pure: false
        }), 
        __metadata('design:paramtypes', [pagination_service_1.PaginationService])
    ], PaginatePipe);
    return PaginatePipe;
})();
exports.PaginatePipe = PaginatePipe;
