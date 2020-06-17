"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
var custome_error_1 = require("./custome-error");
var RequestValidationError = /** @class */ (function (_super) {
    __extends(RequestValidationError, _super);
    function RequestValidationError(errors) {
        var _this = _super.call(this, 'Invalid request Parameters') || this;
        _this.errors = errors;
        _this.statusCode = 400;
        _this.serializeErrors = function () {
            var formatedErrors = _this.errors.map(function (error) {
                return { message: error.msg, field: error.param };
            });
            return formatedErrors;
        };
        return _this;
    }
    return RequestValidationError;
}(custome_error_1.CustomeError));
exports.RequestValidationError = RequestValidationError;
