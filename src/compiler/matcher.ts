import { ReadedInfo, Matcher } from '../model';

const reCondMatcher: Matcher = {
  evalif: (info: ReadedInfo) => `if(${info.content}) { __tpl+='';`,
  evalelseif: (info: ReadedInfo) => `} else if(${info.content}) { __tpl+='';`,
  evalelse: (info?: ReadedInfo) => `} else { __tpl+='';`,
  evalendif: (info?: ReadedInfo) => `} __tpl+='';`,
};

const reLoopMatcher: Matcher = {
  evalloop: (info: ReadedInfo) => `for(${info.content}) {`,
  evalloopend: (info: ReadedInfo) => `}`,
};

const commonMatcher: Matcher = {
  content: (info: ReadedInfo) => `__tpl += \`${info.content}\`;`,
  interpolate: (info: ReadedInfo) => {
    if (/{{/.exec(info.content)) {
      throw new Error('syntax error: {{ is not closed');
    }
    return `__tpl += ${info.content};`;
  },
  evaluate: (info: ReadedInfo) => `${info.content}`,
  comment: (info: ReadedInfo) => '',
};

export const pathMatcher = {
  content: (info: ReadedInfo) => `__tpl += \`${info.content}\`;`,
  interpolate: (info: ReadedInfo) => {
    if (/{{/.exec(info.content)) {
      throw new Error('syntax error: {{ is not closed');
    }
    return `__tpl += ${info.content};`;
  },
};

export const matcher: Matcher = {
  ...commonMatcher,
  ...reCondMatcher,
  ...reLoopMatcher
};