'use strict';

let index = require('..');
let fcon = index.fcon;
let control = index.control;
let assert = require('assert');

describe('base', () => {
    it('base', () => {
        let fc = fcon(function (b) {
            let s = this.s;
            let a = s.vari('b', b) + 4;
            return a;
        });
        assert.equal(fc(5), 9);
    });

    it('replace variable', () => {
        let b = 5;
        let fc = fcon(function () {
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
        let fc = fcon(function (b) {
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
        let fc = fcon(function (b) {
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
});
