'use strict';

let FManager = require('./fManager');

module.exports = () => {
    /**
     * the function is combined by some statements.
     *
     * There are statements, expressions, variables etc.
     */
    let mark = (fun, ctx) => {
        ctx = ctx || {};
        // fc function
        return function () {
            let args = Array.prototype.slice.call(arguments);
            ctx.s = new FManager(this);
            return fun.apply(ctx, args);
        };
    };

    /**
     * TODO check conf, recordTable format
     */
    let control = (fc, conf, opts) => {
        return function () {
            let args = Array.prototype.slice.call(arguments);
            let ctx = {
                conf,
                opts
            };
            return fc.apply(ctx, args);
        };
    };

    return {
        mark,
        control
    };
};
