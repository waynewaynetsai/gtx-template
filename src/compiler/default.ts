import { CompileOption } from '../model';

export const defaultOptions: CompileOption = {
  debug: true,
  delimiter: {
    comment: {
      enable: true
    },
    escape: {
      enable: false
    },
    interpolate: {
      enable: true
    },
    evaluate: {
      enable: false
    },
    forloop: {
      enable: true
    },
    ifelse: {
      enable: true
    },
  }
};
