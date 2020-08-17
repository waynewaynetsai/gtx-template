"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var model_1 = require("../model");
var resettings_1 = require("./resettings");
var matcher_1 = require("./matcher");
var utils_1 = require("./utils");
var default_1 = require("./default");
var source_map_1 = require("source-map");
var path = require("path");
var nextLineCount = function (str) { return str.split('\n').length - 1; };
var fstCharIdx = function (str) {
    var execed = /\S/.exec(str);
    return execed ? execed.index : 0;
};
var nextLineCountBefore = function (str) {
    var idx = fstCharIdx(str);
    if (idx === 0) {
        var count = nextLineCount(str);
        return (count === 0) ? 0 : 1;
    }
    return nextLineCount(str.slice(0, fstCharIdx(str)));
};
var nextLineCountAfter = function (str) {
    var tempStr = tslib_1.__spread(str).reverse().join('');
    var idx = fstCharIdx(tempStr);
    if (idx === 0) {
        var count = nextLineCount(str);
        return (count > 1) ? (count - 1) : 0;
    }
    return nextLineCount(tempStr.slice(0, fstCharIdx(tempStr)));
};
var chunk = function (arr, suite) {
    var i = 0;
    var len = arr.length;
    var chunks = [];
    while (i < len) {
        chunks.push((arr.slice(i, i += suite)));
    }
    return chunks;
};
var tokenize = function (readed) {
    var _delimiters = readed.options.delimiters;
    var delimitersRE = new RegExp(_delimiters.map(function (d) {
        return utils_1.isString(d.prefix) ? resettings_1.reSettings[d.type].custom.pattern(d.prefix) : resettings_1.reSettings[d.type].all.delimiter.source;
    }).join('|'));
    return {
        fragments: readed.content.split(delimitersRE),
        suiteLen: _delimiters.length + 1,
        suiteProps: tslib_1.__spread([{ type: 'content' }], _delimiters)
    };
};
var parser = function (readed) { return function (tokens) {
    var _delimiters = readed.options.delimiters;
    var syntaxNodes = [];
    chunk(tokens.fragments, tokens.suiteLen).reduce(function (prevLoc, expressions) {
        return expressions.reduce(function (prev, text, i) {
            if (!text)
                return prev;
            var columnOffset = text.length + ((i > 0) ?
                utils_1.isString(_delimiters[i - 1].prefix) ?
                    resettings_1.reSettings[tokens.suiteProps[i].type].custom.offset(_delimiters[i - 1].prefix) :
                    resettings_1.reSettings[tokens.suiteProps[i].type].all.offset : 0);
            syntaxNodes.push({
                type: tokens.suiteProps[i].type,
                content: text,
                start: {
                    line: prev.line + nextLineCountBefore(text),
                    column: prev.column
                },
                end: {
                    line: prev.line + nextLineCount(text) - nextLineCountAfter(text),
                    column: prev.column + columnOffset
                }
            });
            return { offset: columnOffset, line: prev.line + nextLineCount(text), column: prev.column + columnOffset };
        }, prevLoc);
    }, { line: 1, column: 0 });
    return {
        type: readed.type,
        source: readed.content,
        syntaxNodes: syntaxNodes
    };
}; };
var contentConverter = function (readed) { return function (parsed) {
    var join = parsed.syntaxNodes.map(function (info) {
        try {
            return matcher_1.matcher[info.type](info);
        }
        catch (err) {
            throw new Error("\n        path: " + readed.path + ", \n        filename: " + readed.filename + ",\n        error: " + err + "\n      ");
        }
    });
    var converted = join.join('\n');
    return "let __data = data || (data = {});\n\n          let __tpl = '';\n\n          with (__data){\n            " + converted + "}\n\n            return __tpl;\n          ";
}; };
var contentWithSourceMap = function (readed) { return function (parsed) {
    var sourceUrl = readed.path;
    var head = new source_map_1.SourceNode(1, 0, sourceUrl, "\n    let __data = data || (data = {});\n\n    let __tpl = '';\n\n    with (__data){\n");
    var body = parsed.syntaxNodes.reduce(function (acc, curr) {
        var lines = curr.content.split('\n');
        return lines.reduce(function (accNode, currLine, i) {
            return accNode.add(new source_map_1.SourceNode(curr.start.line + i, (i === 0) ? curr.start.column : 0, sourceUrl, "\n          " + matcher_1.matcher[curr.type]({ curr: curr, content: currLine }) + "\n          " + (i === lines.length - 1 ? '' : '\n') + "\n        "));
        }, acc);
    }, head);
    var lastNode = parsed.syntaxNodes[parsed.syntaxNodes.length - 1];
    var tail = new source_map_1.SourceNode(lastNode.start.line, lastNode.end.column, sourceUrl, " }\n\n      return __tpl;\n\n  ");
    var nodes = body.add(tail);
    var code = nodes.toStringWithSourceMap({
        file: readed.filename,
        sourceRoot: path.dirname(readed.path),
    });
    code.map.setSourceContent(readed.path, readed.content);
    return code.code
        + '\n//# sourceMappingURL=data:application/json;base64,'
        + Buffer.from(code.map.toString()).toString('base64');
}; };
var pathConverter = function (readed) { return function (parsedpath) {
    var join = parsedpath.syntaxNodes.map(function (info) {
        try {
            return matcher_1.pathMatcher[info.type](info);
        }
        catch (err) {
            throw new Error("\n        path: " + readed.path + ", \n        filename: " + readed.filename + ",\n        error: " + err + "\n      ");
        }
    });
    var converted = join.join('\n');
    return "let __data = data || (data = {});\n\n          let __tpl = '';\n\n          with (__data) {\n\n            " + converted + "\n          }\n\n            return __tpl;\n\n          }\n\n        ";
}; };
var contentTemplate = function (readed) { return utils_1.pipe(tokenize, parser(readed), utils_1.iif(function (_) { return readed.options.debug; }, contentWithSourceMap(readed), contentConverter(readed)))(readed); };
var pathTemplate = function (readed) { return utils_1.pipe(tokenize, parser(readed), pathConverter(readed))(readed); };
var templates = {
    content: contentTemplate,
    path: pathTemplate,
};
var delimiters = function (obj) { return Object.values(obj).reduce(function (acc, curr) { return tslib_1.__spread(curr, acc); }, []); };
var delimiterTypes = utils_1.pipe(utils_1.omitProps(function (_, v) { return !v.enable; }), utils_1.map(function (k, v) { return model_1.optionREMapper[k].map(function (type) { return ({
    type: type, prefix: v.prefix
}); }); }), delimiters);
var compiler = function (type) { return function (template, readed) {
    var options = readed.options;
    var delimiterOptions = tslib_1.__assign({}, default_1.defaultOptions.delimiter, (options || { delimiter: {} }).delimiter);
    var compileOptions = tslib_1.__assign({}, default_1.defaultOptions, (options || { delimiter: {} }), { delimiter: delimiterOptions, delimiters: delimiterTypes(delimiterOptions) });
    try {
        return new Function('data', templates[type](tslib_1.__assign({}, readed, { content: template, options: compileOptions })));
    }
    catch (e) {
        throw new Error("[parsed template error]: incorrect input\n          \npath:" + readed.path + "\n          \n[error]: " + e);
    }
}; };
exports.contentCompiler = compiler('content');
exports.pathCompiler = compiler('path');
//# sourceMappingURL=compiler.js.map