var angular2_1 = require('angular2/angular2');
var PaginationService = (function () {
    function PaginationService() {
        this.change = new angular2_1.EventEmitter();
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
        this.instances[instance.id] = instance;
        this.change.emit(instance.id);
    };
    PaginationService.prototype.getCurrentPage = function (id) {
        if (this.instances[id]) {
            return this.instances[id].currentPage;
        }
    };
    PaginationService.prototype.setCurrentPage = function (id, page) {
        if (this.instances[id]) {
            this.instances[id].currentPage = page;
            this.change.emit(id);
        }
    };
    PaginationService.prototype.setTotalItems = function (id, totalItems) {
        if (this.instances[id]) {
            this.instances[id].totalItems = totalItems;
            this.change.emit(id);
        }
    };
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
})();
exports.PaginationService = PaginationService;
