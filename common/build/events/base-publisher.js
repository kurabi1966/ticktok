"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Publisher = void 0;
var Publisher = /** @class */ (function () {
    function Publisher(client) {
        this.client = client;
    }
    Publisher.prototype.publish = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.client.publish(_this.subject, JSON.stringify(data), function (err) {
                console.log("---- Event has been Published >>>> " + _this.subject + ", data: " + data);
                !err ? resolve() : reject(err);
            });
        });
    };
    return Publisher;
}());
exports.Publisher = Publisher;
