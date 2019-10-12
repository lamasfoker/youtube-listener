"use strict";

const StringParser = {
    parse: (string) => {
        return string.split("&").reduce(function (params, param) {
            let paramSplit = param.split("=").map(function (value) {
                return decodeURIComponent(value.replace("+", " "));
            });
            params[paramSplit[0]] = paramSplit[1];
            return params;
        }, {});
    }
};

export default StringParser;