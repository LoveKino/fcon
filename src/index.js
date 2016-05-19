'use strict';

let FManager = require('./fManager');

/**
 * the function is combined by some statements.
 *
 * There are statements, expressions, variables etc.
 */
let fcon = (fun, ctx) => {
    ctx = ctx || {};
    // fc function
    return function () {
        let args = Array.prototype.slice.call(arguments);
        ctx.s = new FManager(this);
        return fun.apply(ctx, args);
    };
};

/**
 * TODO check conf format
 */
let control = (fc, conf) => {
    return function () {
        let args = Array.prototype.slice.call(arguments);
        return fc.apply(conf, args);
    };
};

module.exports = {
    fcon,
    control
};
