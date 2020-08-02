import {
  ReadedInfo, ReSettings,
  Parsed, Tokenized, SyntaxNode, CompileOption,
  DelimiterOptions, optionREMapper, ReadedOptions, CustomDelimiterOption
} from '../model';
import { reSettings } from './resettings';
import { matcher, pathMatcher } from './matcher';
import { pipe, omitProps, pluck, map, tap, isString } from './utils';
import { defaultOptions } from './default';

const nextLineCount = (str: string) => str.split('\n').length - 1;

const fstCharIdx = (str: string) => {
  const execed = /\S/.exec(str);
  return execed ? execed.index : 0;
};

const nextLineCountBefore = (str: string) => {
  const idx = fstCharIdx(str);
  if (idx === 0) {
    const count = nextLineCount(str);
    return (count === 0) ? 0 : 1;
  }
  return nextLineCount(str.slice(0, fstCharIdx(str)));
};

const nextLineCountAfter = (str: string) => {
  const tempStr = [...str].reverse().join('');
  const idx = fstCharIdx(tempStr);
  if (idx === 0) {
    const count = nextLineCount(str);
    return (count > 1) ? (count - 1) : 0;
  }
  return nextLineCount(tempStr.slice(0, fstCharIdx(tempStr)));
};

const chunk = (arr: any, suite: number) => {
  let i = 0;
  const len = arr.length;
  const chunks = [];
  while (i < len) {
    chunks.push((arr.slice(i, i += suite)));
  }
  return chunks;
};

const tokenize = (readed: ReadedInfo) => {
  const _delimiters = readed.options.delimiters;
  const delimitersRE = new RegExp(
    _delimiters.map(d => {
      return isString(d.prefix) ? reSettings[d.type].custom.pattern(d.prefix) : reSettings[d.type].all.delimiter.source;
    }).join('|')
  );
  return {
    fragments: readed.content.split(delimitersRE),
    suiteLen: _delimiters.length + 1,
    suiteProps: [{ type: 'content' }, ..._delimiters]
  };
};

const parser = (readed: ReadedInfo) => (tokens: Tokenized) => {
  const _delimiters = readed.options.delimiters;
  const syntaxNodes: SyntaxNode[] = [];
  chunk(tokens.fragments, tokens.suiteLen).reduce((prevLoc, expressions: string[]) => {
    return expressions.reduce((prev, text, i) => {
      if (!text) return prev;
      const columnOffset = text.length + (
        (i > 0) ?
          isString(_delimiters[i - 1].prefix) ?
            reSettings[tokens.suiteProps[i].type].custom.offset(_delimiters[i - 1].prefix) :
            reSettings[tokens.suiteProps[i].type].all.offset : 0
      );
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
    syntaxNodes
  };
};

const contentConverter = (readed: ReadedInfo) => async (parsed: Parsed) => {
  const join = parsed.syntaxNodes.map(async (info: any) => {
    try {
      return matcher[info.type](info);
    } catch (err) {
      throw new Error(`
        path: ${readed.path}, 
        filename: ${readed.filename},
        error: ${err}
      `);
    }
  });
  const converted = (await Promise.all(join)).join('\n');
  return `let __data = data || (data = {});\n
          let __tpl = '';\n
          with (__data){
            ${converted}}\n
            return __tpl;
          `;
};

const pathConverter = (readed: ReadedInfo) => async (parsedpath: Parsed) => {
  const join = parsedpath.syntaxNodes.map(async (info: any) => {
    try {
      return pathMatcher[info.type](info);
    } catch (err) {
      throw new Error(`
        path: ${readed.path}, 
        filename: ${readed.filename},
        error: ${err}
      `);
    }
  });
  const converted = (await Promise.all(join)).join('\n');
  return `let __data = data || (data = {});\n
          let __tpl = '';\n
          with (__data) {\n
            ${converted}
          }\n
          return __tpl;
        `;
};

const contentTemplate = (readed: ReadedInfo) => pipe<ReadedInfo, Promise<string>>(
  tokenize,
  parser(readed),
  contentConverter(readed)
)(readed);

const pathTemplate = (readed: ReadedInfo) => pipe<ReadedInfo, Promise<string>>(
  tokenize,
  parser(readed),
  pathConverter(readed)
)(readed);

const templates = {
  content: contentTemplate,
  path: pathTemplate,
};

const delimiters = (obj) => Object.values(obj).reduce((acc: string[], curr: string[]) => [...curr, ...acc], [] as string[]);

const delimiterTypes = pipe<ReadedOptions, { type: string; prefix?: string; }[]>(
  pluck<CompileOption>('delimiter'),
  omitProps<DelimiterOptions>((_, v) => !v.enable),
  map<DelimiterOptions>((k, v) => optionREMapper[k].map(type => ({
    type, prefix: (v as CustomDelimiterOption).prefix
  }))),
  delimiters,
);

const funcFactory = async (readed: ReadedInfo, type: 'path' | 'content') => {
  const funcBody = await templates[type]({
    ...readed,
    options: {
      ...readed.options,
      delimiters: delimiterTypes(readed.options)
    }
  });
  try {
    return new Function('data', funcBody);
  } catch (e) {
    throw new Error(`[parsed template error]: incorrect input
        \npath:${readed.path}
        \n[error]: ${e}`);
  }
};

const compiler = (type: 'content' | 'path') => (template: string, readed: ReadedInfo) =>
  async <T extends { [key: string]: any }>(data: T) => {
    const { options } = readed;
    const compileOptions: CompileOption = {
      ...defaultOptions,
      ...(options || { delimiter: {} }),
      delimiter: {
        ...defaultOptions.delimiter,
        ...(options || { delimiter: {} }).delimiter
      },
    };
    const compileFunc = await funcFactory({ content: template, ...readed, type, options: compileOptions }, type);
    return compileFunc({ ...data });
  };

export const contentCompiler = compiler('content');

export const pathCompiler = compiler('path');
