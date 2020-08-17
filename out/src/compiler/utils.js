"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
exports.isString = function (strLike) { return typeof strLike === 'string'; };
exports.pipe = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (x) { return fns.reduce(function (accFn, fn) { return fn(accFn); }, x); };
};
exports.curry = function (fn, arity) {
    if (arity === void 0) { arity = fn.length; }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length >= arity) {
            return fn.apply(void 0, tslib_1.__spread(args));
        }
        else {
            return exports.curry(fn.bind.apply(fn, tslib_1.__spread([_this], args)), arity - args.length);
        }
    };
};
exports.tap = function (fn) { return function (x) { fn(x); return x; }; };
exports.pluck = function (prop) { return function (obj) { return obj[prop]; }; };
exports.alt = function (fnA, fnB) { return function (val) { return fnA(val) || fnB(val); }; };
exports.iif = function (predicate, ifBlockFn, elseBlockFn) { return function (val) { return predicate(val) ? ifBlockFn(val) : elseBlockFn(val); }; };
exports.omitPropsOrd = function (predicate) { return function (obj) {
    return Object.entries(obj)
        .filter(function (_a) {
        var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
        return !predicate(k, v);
    })
        .reduce(function (filterItemData, _a) {
        var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
        filterItemData[k] = v;
        return filterItemData;
    }, {});
}; };
exports.omitProps = function (predicate) { return function (obj) {
    return Object.entries(obj)
        .filter(function (_a) {
        var _b = tslib_1.__read(_a, 2), k = _b[0], v = _b[1];
        return !predicate(k, v);
    })
        .reduce(function (filterItemData, _a) {
        var _b;
        var _c = tslib_1.__read(_a, 2), k = _c[0], v = _c[1];
        return tslib_1.__assign({}, filterItemData, (_b = {}, _b[k] = v, _b));
    }, {});
}; };
exports.map = function (mapper) { return function (obj) {
    return Object.keys(obj).reduce(function (result, key) {
        result[key] = mapper(key, obj[key]);
        return result;
    }, {});
}; };
//# sourceMappingURL=utils.js.map