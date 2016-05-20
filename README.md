# fcon

Control function's code at variable & function & expression & statement etc level.

[![Build Status](https://travis-ci.org/LoveKino/fcon.svg)](https://travis-ci.org/LoveKino/fcon.svg)
[![Coverage Status](https://coveralls.io/repos/github/LoveKino/fcon/badge.svg?branch=master)](https://coveralls.io/github/LoveKino/fcon?branch=master)

## goal

We know that a function is combined by some variables, expressions and some statements. We want to control a function at those levels. For exmaple:

(1) I want to change a variable's value in a function.

(2) I want to ignore some statements in a function.

More advanced situation:

(1) I want to record a function's effection

(2) I want to replay a function's effection

In code level, for example

```js
var fun = function () {
    var a = 10;  // we want to change it, like we can set a 20
    var b = a;
    b = a + 30; // we want to ignore this line, for some reason
    return b;
}
```

## install

`npm i fcon --save`

## example

eg: We want to replace variable a, give it a new a value 20.

```js
var Fcon = require('fcon');
var fcon = Fcon();
var mark = fcon.mark;
var control = fcon.control;

var fc = mark(function () { // mark function
    var s = this.s;
    var a = 10;
    var b = s.vari('a', a) + 4; 
    return b;
});

fc(); // 14, just like the normal

var fcc = control(fc, { // configure some variables
    'a': {
        type: 'replace',
        value: 20
    }
});

fcc(); // 24, variable a become 20.
```

## basic usage

- step1, create fcon obeject, get mark and control function

```js
var Fcon = require('fcon');
var fcon = Fcon;

var mark = fcon.mark;
var control = fcon.control;
```

- step2, mark your function

`mark(fun)`

mark function. in the function, you can use a special variable s, which you can used to mark variable, expression, funVari, statements etc.

The return of mark is a function too, which can be use directly like the origin function.

```js
var fc = mark(function () {
    var s = this.s; // special variable
    var a = s.vari('a', 10); // mark variable a, a = 10
    var b = a + 4;
    return b;
});

fc(); // 14
```

- step3, control function

`control(fun, config, opts)`

control function. You can make some decisions to the marked points.

```js
config = {
    [name]: {
        type: 'replace' | 'ignore',
        value
    }
}
```

The return of control is a function too which inner variables, expresions and statements etc have been changed by the config.

```js
var fcc = control(fc, {
    'a': {
        type: 'replace', // replace the original variable
        value: 20 // new value is 20
    }
});

fcc(); // 24, the inner variable a is 20
```

There is a configuration in control.

## APIs

### s.vari(name, variable)

Using s.vari api to mark a variable in a function.

The name is used to mark a variable. You can change a variable's value in control's config, just do:

```js
{
    [name]: {
        type: 'replace',
        value: newValue
    }
}
```

If you configure this variable (by name) in control's config, the new function generated from control will have a new value about this variable.

### s.exp(name, lambda)

Using s.exp api to mark a expression in a function.

```js
var Fcon = require('fcon');
var fcon = Fcon();
var mark = fcon.mark;
var control = fcon.control;

var fc = mark(function () { // mark function
    var s = this.s;
    var a = 30;
    var b = s.exp('b', () => a * 2); // mark expression a * 2
    return b;
});

fc(); // 60

var fcc = control(fc, {
    'b': {
        type: 'replace',
        value: 10
    }
});

fcc(); // 10
```

### s.stm(name, statement)

Using s.stm api to mark statement in a function.

You can configure a statement, to ignore it.

```js
var Fcon = require('fcon');
var fcon = Fcon();
var mark = fcon.mark;
var control = fcon.control;

var fc = mark(function () { // mark function
    var s = this.s;
    var a = 30;
    var b =  a + 1;
    s.stm('bPlus', () => {
        b = b + 1;
    });
    return b;
});

fc(); // 32

var fcc = control(fc, {
    'bPlus': {
        type: 'ignore'
    }
});

fcc(); // 31
```

### s.funVar(name, value)

Using s.funVar api to mark a function which will be called in the function.

```js
var Fcon = require('fcon');
var fcon = Fcon();
var mark = fcon.mark;
var control = fcon.control;

var mul = (a, b) => a * b;

var fc = mark(function () { // mark function
    var s = this.s;
    var a = 10, b = 20;
    var c = s.funVar('mul', mul)(a, b);
    return c;
});

fc(); // 200

var fcc = control(fc, {
    'mul': {
        type: 'replace',
        value: 32
    }
});

fcc(); // 32
```

## record value

### recordTable

When you run a function which you make some marks, you can get the results of every variables you marked.

```js
var Fcon = require('fcon');
var fcon = Fcon();
var mark = fcon.mark;
var control = fcon.control;

var mul = (a, b) => a * b;

var fc = mark(function () { // mark function
    var s = this.s;
    var a = s.vari('a', 10), b = s.vari('b', 20);
    var c = s.funVar('mul', mul)(a, b);
    return c;
});

var recordTable = {}; // use to accept variables
var fcc = control(fc, {
    'mul': {
        type: 'replace',
        value: 32
    }
}, {
    recordTable
});

fcc(); 

console.log(recordTable); // {a: 10, b: 20, c: 200}
```

## onRecordTableChange event

You can listen on the recordTable change event.

```js
var Fcon = require('fcon');
var fcon = Fcon();
var mark = fcon.mark;
var control = fcon.control;

var mul = (a, b) => a * b;

var fc = mark(function () { // mark function
    var s = this.s;
    var a = s.vari('a', 10), b = s.vari('b', 20);
    var c = s.funVar('mul', mul)(a, b);
    return c;
});

var recordTable = {}; // use to accept variables
var fcc = control(fc, {
    'mul': {
        type: 'replace',
        value: 32
    }
}, {
    recordTable,
    onRecordTableChange: function (name, value) {
        console.log(this);// this is recordTable
        console.log(name, value);
    }
});

fcc(); 
```
