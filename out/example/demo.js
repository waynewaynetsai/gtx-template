"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var compiler_1 = require("../src/compiler/compiler");
(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
    var templ, template, compiled;
    return tslib_1.__generator(this, function (_a) {
        templ = "@-- dynamic conent from user input --@\n\n    <p> Hello @{{ username }} ! </p>\n    \n    @-- dynamic conent from condition --@\n    \n    @if(!username)\n    <p> Show [ if ] Block! </p>\n    @elseif(username==='anyname')\n    <p> Show [ else if ] Block! </p>\n    @else\n    <p> Show [ else ] Block! </p>\n    @endif\n    \n    @-- dynamic conent from forloop --@\n    \n    @for(let item of items)\n    <p> name: @{{item.name}} </p>\n    @endfor\n    \n    @for(let key in items)\n    <p> @{{ key }} - @{{items[key].name}} </p>\n    @endfor";
        template = compiler_1.contentCompiler(templ, {
            path: __dirname + "/demo.template",
            filename: 'demo.template',
            options: {
                delimiter: {
                    interpolate: {
                        enable: true,
                    },
                    escape: {
                        enable: false
                    }
                },
                debug: true
            }
        });
        compiled = template({
            username: 'Wayne',
            items: [
                {
                    name: 'John'
                },
                {
                    name: 'Allen'
                },
                {
                    name: 'Judy'
                }
            ]
        });
        return [2 /*return*/];
    });
}); })();
//# sourceMappingURL=demo.js.map