"use strict";
exports.__esModule = true;
var parser_1 = require("./parser");
var Argumenty = /** @class */ (function () {
    function Argumenty() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.arguments = args;
        this.parser = new parser_1.ArgumentParser();
    }
    Argumenty.prototype.add = function (arg) {
        this.arguments.push(arg);
        return this;
    };
    Argumenty.prototype.addArg = function (short, long, type, required, transformer) {
        this.arguments.push({ short: short, long: long, type: type, required: required, transformer: transformer });
        return this;
    };
    Argumenty.prototype.parse = function () {
        this.parsed = this.parser.parse(this.arguments);
    };
    Argumenty.prototype.get = function (key) {
        var arg = this.parsed[key];
        return !!arg ? arg.value : null;
    };
    return Argumenty;
}());
exports.Argumenty = Argumenty;
