"use strict";
exports.__esModule = true;
var TransformerHandler = /** @class */ (function () {
    function TransformerHandler() {
    }
    TransformerHandler.prototype.transformArgument = function (arg) {
        if (!arg.transformer) {
            return arg;
        }
        // Call the transformer function
        try {
            var response = arg.transformer(arg);
            console.log("R", response);
            if (!response) {
                console.error("Could not transform argument!"); // TODO: Better message
                return null;
            }
            // If it was a valid response, return the new argument
            return {
                name: arg.name,
                value: response
            };
        }
        catch (e) {
            // If your transformer throws an error you shouldn't be writing transformers
            console.error("Encountered error while transforming argument:");
            console.error(e);
            return null;
        }
    };
    return TransformerHandler;
}());
exports.TransformerHandler = TransformerHandler;
