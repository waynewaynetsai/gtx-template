
interface DelimiterOption {
 enable: boolean;
}

interface PrefixOptions {
 prefix?: string;
}

export interface DelimiterOptions {
 [key: string]: DelimiterOption;
}

export const optionREMapper = {
 evaluate: [
   'evaluate'
 ],
 interpolate: [
   'interpolate'
 ],
 comment: [
   'comment'
 ],
 ifelse: [
   'evalif',
   'evalelseif',
   'evalelse',
   'evalendif'
 ],
 forloop: [
   'evalloop',
   'evalloopend'
 ],
 escape: [
   'escape'
 ],
};
export type CustomDelimiterOption = DelimiterOption & PrefixOptions;

export interface CompileOption {
 delimiter: {
   evaluate?: DelimiterOption;
   interpolate?: CustomDelimiterOption;
   comment?: DelimiterOption;
   ifelse?: DelimiterOption;
   forloop?: DelimiterOption;
   escape?: CustomDelimiterOption;
 };
 helpers?: {
   [key: string]: Function | {
     [key: string]: Function;
   };
 };
 debug?: boolean;
 sourceMap?: boolean;
 dryrun?: boolean;
}

interface RegularSetting {
 delimiterRE?: RegExp;
 delimiters?: { type: string; prefix?: string}[];
}

export type ReadedOptions = CompileOption & RegularSetting;

export interface ReadedInfo {
 type?: 'content' | 'path';
 filename: string;
 path: string;
 content?: string;
 options: ReadedOptions;
}

interface SyntaxChecker {
 syntaxChecker?: (node: SyntaxNode) => void;
}

export type context = ReadedInfo & SyntaxChecker;

export interface Parsed {
 type: 'content' | 'path';
 source: string;
 syntaxNodes: SyntaxNode[];
}

export interface SyntaxNode {
 type: string;
 content: string;
 start: Location;
 end: Location;
}

export interface Tokenized {
 regular: ReSettings;
 fragments: string[];
 suiteLen: number;
 suiteProps: { type: string; prefix?: string; }[];
}

export interface ReSettings {
 [key: string]: {
   custom?: {
     offset: (prefix: string) => number;
     pattern: (prefix: string) => string;
   },
   open: {
     offset: number;
     delimiter: RegExp;
   },
   close: {
     offset: number;
     delimiter: RegExp;
   },
   all: {
     offset: number;
     delimiter: RegExp;
   }
 };
}

export interface Matcher {
 // tslint:disable-next-line:ban-types
 [key: string]: Function;
}

export interface Location {
 column: number;
 line: number;
}
