"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var reVariableEvaluate = {
    evaluate: {
        all: {
            offset: 7,
            delimiter: /@eval\((.+)\)(?![\w%\*\+\-&|])/g,
        },
        open: {
            offset: 6,
            delimiter: /@eval\(/g
        },
        close: {
            offset: 1,
            delimiter: /\)/g
        }
    }
};
var reCondEvaluate = {
    evalif: {
        all: {
            offset: 5,
            delimiter: /@if\((.+)\)(?![\w%\*\+\-&|])/g,
        },
        open: {
            offset: 4,
            delimiter: /@if\(/
        },
        close: {
            offset: 1,
            delimiter: /\)/
        }
    },
    evalelseif: {
        all: {
            offset: 9,
            delimiter: /@elseif\((.+)\)(?![\w%\*\+\-&|])/g
        },
        open: {
            offset: 8,
            delimiter: /@elseif\(/
        },
        close: {
            offset: 1,
            delimiter: /\)/
        }
    },
    evalelse: {
        all: {
            offset: 5,
            delimiter: /(@else)/g,
        },
        open: {
            offset: 5,
            delimiter: /(@else)/
        },
        close: {
            offset: 5,
            delimiter: /(@else)/
        }
    },
    evalendif: {
        all: {
            offset: 6,
            delimiter: /(@endif)/g
        },
        open: {
            offset: 6,
            delimiter: /(@endif)/
        },
        close: {
            offset: 6,
            delimiter: /(@endif)/
        }
    }
};
var reLoopEvaluate = {
    evalloop: {
        all: {
            offset: 6,
            delimiter: /@for\(([^)]+)\)/g
        },
        open: {
            offset: 5,
            delimiter: /@for\(/
        },
        close: {
            offset: 1,
            delimiter: /\)/
        }
    },
    evalloopend: {
        all: {
            offset: 7,
            delimiter: /(@endfor)/g
        },
        open: {
            offset: 7,
            delimiter: /@endfor/
        },
        close: {
            offset: 7,
            delimiter: /@endfor/
        }
    }
};
var reCommon = {
    interpolate: {
        custom: {
            offset: function (prefix) { return prefix.length + reCommon.interpolate.all.offset - 1; },
            pattern: function (prefix) { return prefix + "{{([\\s\\S]+?)}}"; }
        },
        all: {
            offset: 5,
            delimiter: /@{{([\s\S]+?)}}/g
        },
        open: {
            offset: 3,
            delimiter: /@{{/
        },
        close: {
            offset: 2,
            delimiter: /}}/
        },
    },
    comment: {
        all: {
            offset: 6,
            delimiter: /@--(.+)--@/g
        },
        open: {
            offset: 3,
            delimiter: /@--/
        },
        close: {
            offset: 3,
            delimiter: /--@/
        }
    },
    escape: {
        custom: {
            offset: function (prefix) { return prefix.length + reCommon.interpolate.all.offset - 1; },
            pattern: function (prefix) { return prefix + "{{-([\\s\\S]+?)-}}"; }
        },
        all: {
            offset: 6,
            delimiter: /@{{-([\s\S]+?)-}}/g
        },
        open: {
            offset: 4,
            delimiter: /@{{-/
        },
        close: {
            offset: 2,
            delimiter: /}}/
        },
    }
};
exports.reSettings = tslib_1.__assign({}, reCommon, reVariableEvaluate, reCondEvaluate, reLoopEvaluate);
exports.rePath = {
    interpolate: {
        all: {
            offset: 5,
            delimiter: /@{{([\s\S]+?)}}/g
        },
        open: {
            offset: 3,
            delimiter: /@{{/
        },
        close: {
            offset: 2,
            delimiter: /}}/
        },
    }
};
//# sourceMappingURL=resettings.js.map