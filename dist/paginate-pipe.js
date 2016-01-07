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
var LARGE_NUMBER = 999999999;
var PaginatePipe = (function () {
    function PaginatePipe(service) {
        this.service = service;
        // store the values from the last time the pipe
        this.state = {};
    }
    PaginatePipe.prototype.transform = function (collection, args) {
        // for non-array types, throw an exception
        if (!(collection instanceof Array)) {
            throw new Error("PaginationPipe: Argument error - expected an array, got " + typeof collection);
        }
        var usingConfig = typeof args[0] === 'object';
        var serverSideMode = usingConfig && args[0].totalItems !== undefined;
        var instance = this.createInstance(collection, args);
        var id = instance.id;
        var start, end;
        this.service.register(instance);
        if (!usingConfig && instance.totalItems !== collection.length) {
            this.service.setTotalItems(id, collection.length);
        }
        var itemsPerPage = instance.itemsPerPage;
        if (!serverSideMode && collection instanceof Array) {
            itemsPerPage = itemsPerPage || LARGE_NUMBER;
            start = (this.service.getCurrentPage(id) - 1) * itemsPerPage;
            end = start + itemsPerPage;
            var isIdentical = this.stateIsIdentical(id, collection, start, end);
            if (isIdentical) {
                return this.state[id].slice;
            }
            else {
                var slice = collection.slice(start, end);
                this.saveState(id, collection, slice, start, end);
                return slice;
            }
        }
        return collection;
    };
    PaginatePipe.prototype.createInstance = function (collection, args) {
        var instance;
        if (typeof args[0] === 'string' || typeof args[0] === 'number') {
            var id = this.service.defaultId;
            instance = {
                id: id,
                itemsPerPage: parseInt(args[0]),
                currentPage: this.service.getCurrentPage(id) || 1,
                totalItems: collection.length
            };
        }
        else if (typeof args[0] === 'object') {
            instance = {
                id: args[0].id || this.service.defaultId,
                itemsPerPage: args[0].itemsPerPage || 0,
                currentPage: args[0].currentPage,
                totalItems: args[0].totalItems || collection.length
            };
        }
        else {
            throw new Error("PaginatePipe: Argument must be a string, number or an object. Got " + typeof args[0]);
        }
        return instance;
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
            slice: slice,
            start: start,
            end: end
        };
    };
    /**
     * For a given id, returns true if the collection, start and end values are identical.
     */
    PaginatePipe.prototype.stateIsIdentical = function (id, collection, start, end) {
        var state = this.state[id];
        if (!state) {
            return false;
        }
        return state.collection === collection && state.start === start && state.end === end;
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
