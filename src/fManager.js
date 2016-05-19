'use strict';

let util = require('./util');
let isString = util.isString;
let isFunction = util.isFunction;
let checkType = util.checkType;

let hasReplaceName = (name, conf) => {
    let item = conf[name];
    if(!item) return false;
    return item.type === 'replace';
};

let getReplaceValue = (name, conf) => conf[name].value;

let shouldIgnore = (name, conf) => {
    let item = conf[name];
    if(!item) return false;
    return item.type === 'ignore';
};

/**
 * conf = {
 *      [name]: {
 *          type: replace | ignore,
 *          value
 *      }
 * }
 */
let FManager = function (conf) {
    this.conf = conf || {};
};

FManager.prototype = {
    constructor: FManager,
    // variable
    vari: function (name, variable) {
        checkType(name, isString, 'string');
        if(hasReplaceName(name, this.conf)) {
            return getReplaceValue(name, this.conf);
        }
        return variable;
    },
    // statement
    stm: function (name, line) {
        checkType(name, isString, 'string');
        checkType(line, isFunction, 'function');
        if(shouldIgnore(name, this.conf)) {
            return;
        }
        return line();
    },
    // expression
    exp: function (name, lambda) {
        checkType(name, isString, 'string');
        checkType(lambda, isFunction, 'function');
        if(hasReplaceName(name, this.conf)) {
            return getReplaceValue(name, this.conf);
        }
        return lambda();
    }
};

module.exports = FManager;
