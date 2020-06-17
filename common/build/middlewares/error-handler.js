"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var custome_error_1 = require("../errors/custome-error");
exports.errorHandler = function (err, req, res, next) {
    if (err instanceof custome_error_1.CustomeError) {
        res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    else {
        // console.error(err);
        return res.status(400).send({ errors: [{ message: err.message }] });
    }
};
