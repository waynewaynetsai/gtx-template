"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var reCondMatcher = {
    evalif: function (info) { return "if(" + info.content + ") {"; },
    evalelseif: function (info) { return "} else if(" + info.content + ") {"; },
    evalelse: function (info) { return "} else { "; },
    evalendif: function (info) { return "}"; },
};
var reLoopMatcher = {
    evalloop: function (info) { return "for(" + info.content + ") { "; },
    evalloopend: function (info) { return "} "; },
};
var commonMatcher = {
    content: function (info) { return "__tpl += `" + info.content + "`;"; },
    interpolate: function (info) {
        if (/{{/.exec(info.content)) {
            throw new Error('syntax error: {{ is not closed');
        }
        return "__tpl += `${" + info.content + "}`;";
    },
    evaluate: function (info) { return "" + info.content; },
    comment: function (info) { return ''; },
};
exports.pathMatcher = {
    content: function (info) { return "__tpl += `" + info.content + "`;"; },
    interpolate: function (info) {
        if (/{{/.exec(info.content)) {
            throw new Error('syntax error: {{ is not closed');
        }
        return "__tpl += " + info.content + ";";
    },
};
exports.matcher = tslib_1.__assign({}, commonMatcher, reCondMatcher, reLoopMatcher);
//# sourceMappingURL=matcher.js.map