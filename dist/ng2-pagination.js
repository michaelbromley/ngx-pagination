"use strict";
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var paginate_pipe_1 = require('./paginate.pipe');
var pagination_service_1 = require('./pagination.service');
var pagination_controls_component_1 = require('./pagination-controls.component');
var pagination_controls_directive_1 = require('./pagination-controls.directive');
var pagination_service_2 = require('./pagination.service');
exports.PaginationService = pagination_service_2.PaginationService;
var pagination_controls_component_2 = require('./pagination-controls.component');
exports.PaginationControlsComponent = pagination_controls_component_2.PaginationControlsComponent;
var pagination_controls_directive_2 = require('./pagination-controls.directive');
exports.PaginationControlsDirective = pagination_controls_directive_2.PaginationControlsDirective;
var paginate_pipe_2 = require('./paginate.pipe');
exports.PaginatePipe = paginate_pipe_2.PaginatePipe;
var Ng2PaginationModule = (function () {
    function Ng2PaginationModule() {
    }
    Ng2PaginationModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    declarations: [
                        paginate_pipe_1.PaginatePipe,
                        pagination_controls_component_1.PaginationControlsComponent,
                        pagination_controls_directive_1.PaginationControlsDirective
                    ],
                    providers: [pagination_service_1.PaginationService],
                    exports: [paginate_pipe_1.PaginatePipe, pagination_controls_component_1.PaginationControlsComponent, pagination_controls_directive_1.PaginationControlsDirective]
                },] },
    ];
    /** @nocollapse */
    Ng2PaginationModule.ctorParameters = function () { return []; };
    return Ng2PaginationModule;
}());
exports.Ng2PaginationModule = Ng2PaginationModule;
