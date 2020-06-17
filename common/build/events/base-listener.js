"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
var Listener = /** @class */ (function () {
    function Listener(client) {
        this.ackWait = 5 * 1000;
        this.client = client;
    }
    Listener.prototype.subscriptionOptions = function () {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    };
    Listener.prototype.listen = function () {
        var _this = this;
        console.log("----- Listeneing to >>>> " + this.subject);
        try {
            var subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
            console.log('subscription is ready');
            subscription.on('message', function (msg) {
                console.log("----- Message received from >>>> " + _this.subject + " / " + _this.queueGroupName);
                var parsedData = _this.parseMessage(msg);
                _this.onMessage(parsedData, msg);
            });
        }
        catch (error) {
            console.log('------ Error >>>>', error);
        }
    };
    Listener.prototype.parseMessage = function (msg) {
        var data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    };
    return Listener;
}());
exports.Listener = Listener;
