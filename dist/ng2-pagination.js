"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
    Ng2PaginationModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [
                paginate_pipe_1.PaginatePipe,
                pagination_controls_cmp_1.PaginationControlsCmp
            ],
            providers: [pagination_service_1.PaginationService],
            exports: [paginate_pipe_1.PaginatePipe, pagination_controls_cmp_1.PaginationControlsCmp]
        }), 
        __metadata('design:paramtypes', [])
    ], Ng2PaginationModule);
    return Ng2PaginationModule;
}());
exports.Ng2PaginationModule = Ng2PaginationModule;
