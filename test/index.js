'use strict';

let Fcon = require('..');

let fcon = Fcon();
let mark = fcon.mark;
let control = fcon.control;

let assert = require('assert');

describe('base', () => {
    it('base', () => {
        let fc = mark(function (b) {
            let s = this.s;
            let a = s.vari('b', b) + 4;
            return a;
        });
        assert.equal(fc(5), 9);
    });

    it('replace variable', () => {
        let b = 5;
        let fc = mark(function () {
            let s = this.s;
            let a = s.vari('b', b) + 4;
            return a;
        });

        let fcc = control(fc, {
            b: {
                type: 'replace',
                value: 10
            }
        });

        let ret = fcc();
        assert.equal(ret, 14);
    });

    it('replace expression', () => {
        let fc = mark(function (b) {
            let s = this.s;
            let a = s.exp('e', () => b + 23);
            return a;
        });

        let fcc = control(fc, {
            e: {
                type: 'replace',
                value: 10
            }
        });

        let ret = fcc();
        assert.equal(ret, 10);
    });

    it('ignore statement', () => {
        let fc = mark(function (b) {
            let s = this.s;
            let a = 2;
            s.stm('stm', () => {
                a = a + b;
            });
            return a;
        });

        let fcc = control(fc, {
            'stm': {
                type: 'ignore'
            }
        });

        assert.equal(fc(8), 10);
        assert.equal(fcc(), 2);
    });

    it('replace fun variable', () => {
        var mul = (a, b) => a * b;
        let fc = mark(function (b) {
            let s = this.s;
            let a = 2;
            let c = s.funVar('mul', mul)(a, b);
            return c;
        });

        let fcc = control(fc, {
            'mul': {
                type: 'replace',
                value: 20
            }
        });

        assert.equal(fc(8), 16);
        assert.equal(fcc(), 20);
        assert.equal(fc(9), 18);
    });

    it('recordTable', () => {
        let fc = mark(function () {
            let s = this.s;
            let a = 30;
            let b = s.exp('e', () => a + 50);
            b--;
            let c = s.vari('b', b) + 40;
            return c;
        });

        let recordTable = {};
        let fcc = control(fc, null, {
            recordTable
        });
        fcc();
        assert.deepEqual(recordTable, {
            e: 80,
            b: 79
        });
    });

    it('recordTable async', (done) => {
        let fc = mark(function () {
            let s = this.s;
            let a = s.vari('a', 50);
            return new Promise((resolve) => {
                setTimeout(() => {
                    let b = s.exp('b', () => a + 20);
                    resolve(b);
                }, 20);
            });
        });

        let recordTable = {};
        let fcc = control(fc, null, {
            recordTable
        });
        let ret = fcc();
        assert.deepEqual(recordTable, {
            a: 50
        });
        ret.then(() => {
            assert.deepEqual(recordTable, {
                a: 50,
                b: 70
            });
            done();
        });
    });

    it('recordTable onChange', () => {
        let fc = mark(function () {
            let s = this.s;
            let a = s.vari('a', 50);
            let b = s.exp('b', () => a + 2);
            return b;
        });

        let recordTable = {};

        let rets = [];
        let onRecordTableChange = (name, value) => {
            rets.push([name, value]);
        };

        let fcc = control(fc, null, {
            recordTable,
            onRecordTableChange
        });
        fcc();
        assert.deepEqual(rets, [['a', 50], ['b', 52]]);
    });
});
