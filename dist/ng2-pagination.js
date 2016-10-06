"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var paginate_pipe_1 = require('./paginate-pipe');
var pagination_service_1 = require('./pagination-service');
var pagination_controls_cmp_1 = require('./pagination-controls-cmp');
var pagination_service_2 = require('./pagination-service');
exports.PaginationService = pagination_service_2.PaginationService;
var pagination_controls_cmp_2 = require('./pagination-controls-cmp');
exports.PaginationControlsCmp = pagination_controls_cmp_2.PaginationControlsCmp;
var paginate_pipe_2 = require('./paginate-pipe');
exports.PaginatePipe = paginate_pipe_2.PaginatePipe;
var Ng2PaginationModule = (function () {
    function Ng2PaginationModule() {
    }
    Ng2PaginationModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    declarations: [
                        paginate_pipe_1.PaginatePipe,
                        pagination_controls_cmp_1.PaginationControlsCmp
                    ],
                    providers: [pagination_service_1.PaginationService],
                    exports: [paginate_pipe_1.PaginatePipe, pagination_controls_cmp_1.PaginationControlsCmp]
                },] },
    ];
    /** @nocollapse */
    Ng2PaginationModule.ctorParameters = [];
    return Ng2PaginationModule;
}());
exports.Ng2PaginationModule = Ng2PaginationModule;
