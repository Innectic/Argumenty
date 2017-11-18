"use strict";
exports.__esModule = true;
var transformer_1 = require("./transformer");
/**
 * Parse command line arguments
 */
var ArgumentParser = /** @class */ (function () {
    function ArgumentParser() {
        this.transformer = new transformer_1.TransformerHandler();
    }
    ArgumentParser.prototype.parse = function (args) {
        var parsed = {};
        // We loop by index here, so we can peek forward
        var length = process.argv.length;
        var _loop_1 = function (i) {
            var argument = process.argv[i];
            if (!argument.startsWith("-")) {
                return out_i_1 = i, "continue";
            }
            var long = argument.substr(0, 2) === "--";
            argument = argument.substr(long ? 2 : 1);
            // @Speed: holy cow this is slow
            var filtered = args.filter(function (arg) { return (arg.long === argument && long) || (arg.short === argument && !long); });
            if (filtered.length === 0 || filtered.length > 1) {
                // Invalid argument
                console.error("Argument '" + argument + "' is invalid!"); // TODO: Show help here
                return out_i_1 = i, "continue";
            }
            // Since we have this argument, lets use it.
            var filterArgument = filtered[0];
            var displayName = long ? filterArgument.long : filterArgument.short;
            // Check the types of the argument, see if we need to pull something else
            switch (filterArgument.type) {
                case "flag": {
                    // Flags just need to exist, no value needed!
                    // Example: -v / --verbose
                    parsed[filterArgument.long] = {
                        name: filterArgument.long,
                        value: true,
                        transformer: filterArgument.transformer
                    };
                    return out_i_1 = i, "continue";
                }
                case "boolean": {
                    // If we want a boolean, it MUST be true or false.
                    // So, lets verify we have another arg, and it's what we want
                    // Make sure there's something next
                    if (!process.argv[i + 1]) {
                        console.error("Argument '" + displayName + "' must have a following boolean (true / false) value!");
                        return out_i_1 = i, "continue";
                    }
                    // Check the value
                    var next = process.argv[i + 1];
                    if (next !== "true" && next !== "false") {
                        console.error("Value for argument '" + displayName + "' must be true or false!");
                        return out_i_1 = i, "continue";
                    }
                    parsed[filterArgument.long] = {
                        name: filterArgument.long,
                        value: next === "true" ? true : false,
                        transformer: filterArgument.transformer
                    };
                    // Make sure to account for the arg we just took!
                    i++;
                    return out_i_1 = i, "continue";
                }
                case "number": {
                    // If we want a number, just need to make sure the next arg
                    // is a number.
                    if (!process.argv[i + 1]) {
                        console.error("Argument '" + displayName + "' must have a following number!");
                        return out_i_1 = i, "continue";
                    }
                    var next = process.argv[i + 1];
                    if (!+next) {
                        console.error("Argument " + displayName + " requires a following number!");
                        return out_i_1 = i, "continue";
                    }
                    parsed[filterArgument.long] = {
                        name: filterArgument.long,
                        value: +next,
                        transformer: filterArgument.transformer
                    };
                    // Make sure to account for the arg we just took!
                    i++;
                    return out_i_1 = i, "continue";
                }
                case "remaining": {
                }
                case "string": {
                    // Make sure we have something to use
                    if (!process.argv[i + 1]) {
                        console.error("Argument '" + displayName + "' requires a string value!");
                        return out_i_1 = i, "continue";
                    }
                    var next = process.argv[i + 1];
                    // If we start with ", then we need to pull until we find the next one
                    if (next.startsWith("\"")) {
                        var value = "";
                        for (var j = i; j < length; j++) {
                            var current = process.argv[j];
                            if (current.endsWith("\"")) {
                                // Then this is the end
                                i += j;
                                parsed[filterArgument.long] = {
                                    name: filterArgument.long,
                                    value: value.trim(),
                                    transformer: filterArgument.transformer
                                };
                                break;
                            }
                            // Not the end, append
                            value += current + " ";
                            continue;
                        }
                    }
                    else {
                        // Otherwise, lets just take the next one
                        parsed[filterArgument.long] = {
                            name: filterArgument.long,
                            value: next,
                            transformer: filterArgument.transformer
                        };
                        // Account for the arg we just took
                        i++;
                        return out_i_1 = i, "continue";
                    }
                }
            }
            out_i_1 = i;
        };
        var out_i_1;
        for (var i = 1; i < length; i++) {
            _loop_1(i);
            i = out_i_1;
        }
        // Transform all arguments
        for (var key in parsed) {
            console.log(parsed[key]);
            parsed[key] = this.transformer.transformArgument(parsed[key]);
        }
        return parsed;
    };
    return ArgumentParser;
}());
exports.ArgumentParser = ArgumentParser;
