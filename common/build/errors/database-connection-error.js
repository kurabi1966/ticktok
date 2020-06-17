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
exports.DatabaseConnectionError = void 0;
var custome_error_1 = require("./custome-error");
var DatabaseConnectionError = /** @class */ (function (_super) {
    __extends(DatabaseConnectionError, _super);
    function DatabaseConnectionError() {
        var _this = _super.call(this, 'Error connecting to database') || this;
        _this.statusCode = 500;
        _this.serializeErrors = function () {
            return [{ message: 'Error connecting to database' }];
        };
        return _this;
    }
    return DatabaseConnectionError;
}(custome_error_1.CustomeError));
exports.DatabaseConnectionError = DatabaseConnectionError;
