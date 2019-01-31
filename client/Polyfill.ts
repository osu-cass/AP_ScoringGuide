/* tslint:disable */
declare interface ObjectConstructor {
  assign<T1, T2>(target: T1, ...sources: T2[]): T1 & T2;
}

declare interface Array<T> {
  find(predicate: (search: T) => boolean): T;
}

declare interface String {
  startsWith(str: string): boolean;
  endsWith(str: string): boolean;
}

if (typeof Object.assign != 'function') {
  Object.assign = function(target: any, varArgs: any) {
    // .length of function is 2
    'use strict';
    if (target == undefined) {
      // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    const to = Object(target);

    for (let index = 1; index < arguments.length; index++) {
      const nextSource = arguments[index];

      if (nextSource != undefined) {
        // Skip over if undefined or null
        for (const nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate: any) {
    if (this == undefined) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    const list = Object(this);
    const length = list.length >>> 0;
    const thisArg = arguments[1];
    let value;

    for (let i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString: string) {
    return this.substr(0, searchString.length) === searchString;
  };
}

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(suffix: string) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
}
