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

let recordValue = (recordTable, name, value, onChange) => {
    recordTable[name] = value;
    // emit event
    onChange && onChange.call(recordTable, name, value);
};

/**
 * conf = {
 *      [name]: {
 *          type: replace | ignore,
 *          value
 *      }
 * }
 */
let FManager = function (args) {
    args = args || {};
    this.conf = args.conf || {};
    let opts = args.opts || {};
    this.recordTable = opts.recordTable || {};
    this.onRecordTableChange = opts.onRecordTableChange;
};

FManager.prototype = {
    constructor: FManager,

    // variable
    vari: function (name, variable) {
        checkType(name, isString, 'string');
        let ret = variable;
        if(hasReplaceName(name, this.conf)) {
            ret = getReplaceValue(name, this.conf);
        }
        recordValue(this.recordTable, name, ret, this.onRecordTableChange);
        return ret;
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
            let ret = getReplaceValue(name, this.conf);
            recordValue(this.recordTable, name, ret, this.onRecordTableChange);
            return ret;
        }
        let ret = lambda();
        recordValue(this.recordTable, name, ret, this.onRecordTableChange);
        return ret;
    },

    // function variable
    funVar: function (name, fun) {
        checkType(name, isString, 'string');
        checkType(fun, isFunction, 'function');
        let self = this;
        return function () {
            let args = Array.prototype.slice.call(arguments);
            if(hasReplaceName(name, self.conf)) {
                let ret = getReplaceValue(name, self.conf);
                recordValue(self.recordTable, name, ret, self.onRecordTableChange);
                return ret;
            }
            let ret = fun.apply(this, args);
            recordValue(self.recordTable, name, ret, self.onRecordTableChange);
            return ret;
        };
    }
};

module.exports = FManager;
