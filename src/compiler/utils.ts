export const isString = (strLike: any): boolean => typeof strLike === 'string';

interface ObjectLike { [key: string]: any; }

export const pipe = <T, R>(...fns: Function[]) => (x: T) => fns.reduce((accFn, fn) => fn(accFn), x) as R;

export const curry = (fn, arity = fn.length) => (...args) => {
  if (args.length >= arity) {
    return fn(...args);
  } else {
    return curry(fn.bind(this, ...args), arity - args.length);
  }
};

export const tap = <T>(fn: (arg: T) => any) => (x: T) => { fn(x); return x; };

export const pluck = <T extends ObjectLike>(prop: keyof T) => (obj: T) => obj[prop];

export const omitPropsOrd = <T extends ObjectLike>(predicate: (key: keyof T, value: T[keyof T]) => boolean) => (obj: T) =>
  Object.entries(obj)
    .filter(([k, v]) => !predicate(k, v))
    .reduce((filterItemData, [k, v]) => {
      filterItemData[k] = v;
      return filterItemData;
    }, {});

export const omitProps = <T extends ObjectLike>(predicate: (key: keyof T, value: T[keyof T]) => boolean) => (obj: T) =>
  Object.entries(obj)
    .filter(([k, v]) => !predicate(k, v))
    .reduce((filterItemData, [k, v]) => {
      return {
        ...filterItemData,
        ...{ [k]: v }
      };
    }, {});

export const map = <T extends ObjectLike>(mapper: (k: keyof T, v: T[keyof T]) => any) => (obj: T) =>
  Object.keys(obj).reduce((result, key) => {
    result[key] = mapper(key as any, obj[key]);
    return result;
  }, {});
