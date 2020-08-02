import { ReSettings } from '../model';

const reVariableEvaluate: ReSettings = {
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

const reCondEvaluate: ReSettings = {
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

const reLoopEvaluate: ReSettings = {
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

const reCommon: ReSettings = {
  interpolate: {
    custom: {
      offset: (prefix: string) => prefix.length + reCommon.interpolate.all.offset - 1,
      pattern: (prefix: string) => `${prefix}{{([\\s\\S]+?)}}`
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
      offset: (prefix: string) => prefix.length + reCommon.interpolate.all.offset - 1,
      pattern: (prefix: string) => `${prefix}{{-([\\s\\S]+?)-}}`
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

export const reSettings: ReSettings = {
  ...reCommon,
  ...reVariableEvaluate,
  ...reCondEvaluate,
  ...reLoopEvaluate
};

export const rePath = {
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
