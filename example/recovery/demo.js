'use strict';

var Fcon = require('../../index');
var fcon = Fcon();
var mark = fcon.mark;
var control = fcon.control;

var ctx = {
    getA: () => Math.random(),
    getB: (a) => a + Math.random()
};

var proc = mark(function () {
    let s = this.s;
    let a = s.funVar('a', ctx.getA)();
    return new Promise((resolve) => {
        setTimeout(() => {
            let b = s.funVar('b', ctx.getB)(a);
            resolve(a + b + 10);
        }, 20);
    });
});

let recordTable = {
};

let timeline = [];

let fcc = control(proc, null, {
    recordTable,
    onRecordTableChange: function () {
        timeline.push(JSON.parse(JSON.stringify(this))); // copy the ctx
    }
});

let ret = fcc();

let timePointToConf = (ctx) => {
    let ret = {};
    for(var name in ctx) {
        ret[name] = {
            type: 'replace',
            value: ctx[name]
        };
    }
    return ret;
};

ret.then((v) => {
    // recovery from timeline 0
    let v0P = control(proc, timePointToConf(timeline[0]))();
    let v1P = control(proc, timePointToConf(timeline[1]))();
    Promise.all([v0P, v1P]).then((list) => {
        console.log(v, list[0], list[1]);
    });
});
