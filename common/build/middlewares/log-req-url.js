"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logReqUrl = void 0;
// ----------------------------------
exports.logReqUrl = function (req, res, next) {
    console.log("auth: " + req.url);
    next();
};
