'use strict';

module.exports = {
    isString: v => typeof v === 'string',
    isFunction: v => typeof v === 'function',
    // TODO stack pop
    checkType: (value, type, typeName) => {
        if(!type(value)) {
            throw new TypeError('Expected type ' + typeName + '. but got value ' + value);
        }
    }
};
