# referee-sinon

Sinon.JS and the referee assertion library in one package.

## Usage

```shell
npm install @sinonjs/referee-sinon --save-dev
```

Note that you don't need to install `@sinonjs/referee` or `sinon`.

```js
const referee = require("@sinonjs/referee-sinon");

const assert = referee.assert;
const refute = referee.refute;
const sinon = referee.sinon;
```

Or, [if you can make use][compat] of [destructuring assignments][mdn]:

```js
const { assert, refute, sinon } = require("@sinonjs/referee-sinon");
```

[compat]: http://kangax.github.io/compat-table/es6/#test-destructuring
[mdn]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment

## Sinon

The exposed `sinon` object is the full Sinon.JS API as [documented on the Sinon.JS homepage](http://sinonjs.org).

## Assertions

The descriptions are for `assert`, but the corresponding failure messages for `refute` are also mentioned. For refute the behaviour is exactly opposite.

_Overview:_

- [`called()`](#called)
- [`callCount()`](#callcount)
- [`callOrder()`](#callorder)
- [`calledOnce()`](#calledonce)
- [`calledTwice()`](#calledtwice)
- [`calledThrice()`](#calledthrice)
- [`calledOn()`](#calledon)
- [`alwaysCalledOn()`](#alwayscalledon)
- [`calledWith()`](#calledwith)
- [`calledWithNew()`](#calledwithnew)
- [`alwaysCalledWith()`](alwayscalledwith)
- [`alwaysCalledWithNew()`](alwayscalledwithnew)
- [`calledOnceWith()`](#calledoncewith)
- [`calledWithExactly()`](#calledwithexactly)
- [`alwaysCalledWithExactly()`](#alwayscalledwithexactly)
- [`threw()`](#threw)
- [`alwaysThrew()`](#alwaysthrew)

### `called()`

```js
assert.called(spy);
```

Fails if the `spy` has never been called.

```js
var spy = this.spy();

assert.called(spy); // Fails

spy();
assert.called(spy); // Passes

spy();
assert.called(spy); // Passes
```

#### Messages

```js
assert.called.message =
  "Expected ${0} to be called at least once but was never called";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
</dl>

```js
refute.called.message =
  "Expected ${0} to not be called but was called ${1}${2}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The number of calls as a string. Ex: “two times”</dd>
    <dt>`${2}`:</dt>
    <dd>All calls formatted as a multi-line string</dd>
</dl>

### `callCount()`

```js
assert.callCount(spy, count);
```

Fails if the `spy`'s `callCount` property is not exactly `count`

```js
var spy = this.spy();

assert.callCount(spy, 0); // Passes
assert.callCount(spy, 1); // Fails

spy();
assert.callCount(spy, 0); // Fails
assert.callCount(spy, 1); // Passes
```

#### Messages

```js
assert.called.message =
  "Expected ${spyObj} to be called exactly ${expectedTimes} times, but was called ${actualTimes}";
refute.called.message =
  "Expected ${spyObj} to not be called exactly ${expectedTimes} times";
```

<dl>
    <dt>`${spyObj}`:</dt>
    <dd>The spy</dd>
    <dt>`${expectedTimes}`:</dt>
    <dd>The expected number of calls</dd>
    <dt>`${actualTimes}`:</dt>
    <dd>The actual number of calls</dd>
</dl>

### `callOrder()`

```js
assert.callOrder(spy, spy2, ...)
```

Fails if the spies were not called in the specified order.

```js
var spy1 = this.spy();
var spy2 = this.spy();
var spy3 = this.spy();

spy1();
spy2();
spy3();

assert.callOrder(spy1, spy3, spy2); // Fails
assert.callOrder(spy1, spy2, spy3); // Passes
```

#### Messages

```js
assert.callOrder.message =
  "Expected ${expected} to be called in order but were called as ${actual}";
refute.callOrder.message = "Expected ${expected} not to be called in order";
```

<dl>
    <dt>`${expected}`:</dt>
    <dd>A string representation of the expected call order</dd>
    <dt>`${actual}`:</dt>
    <dd>A string representation of the actual call order</dd>
</dl>

### `calledOnce()`

```js
assert.calledOnce(spy);
```

Fails if the `spy` has never been called or if it was called more than once.

```js
var spy = this.spy();

assert.calledOnce(spy); // Fails

spy();
assert.calledOnce(spy); // Passes

spy();
assert.calledOnce(spy); // Fails
```

#### Messages

```
assert.calledOnce.message = "Expected ${0} to be called once but was called ${1}${2}";
refute.calledOnce.message = "Expected ${0} to not be called exactly once${2}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The number of calls, as a string. Ex: “two times”</dd>
    <dt>`${2}`:</dt>
    <dd>The call log. All calls as a string. Each line is one call and includes passed arguments, returned value and more</dd>
</dl>

### `calledTwice()`

```js
assert.calledTwice(spy);
```

Only passes if the `spy` was called exactly twice.

```js
var spy = this.spy();

assert.calledTwice(spy); // Fails

spy();
assert.calledTwice(spy); // Fails

spy();
assert.calledTwice(spy); // Passes

spy();
assert.calledTwice(spy); // Fails
```

#### Messages

```js
assert.calledTwice.message =
  "Expected ${0} to be called twice but was called ${1}${2}";
refute.calledTwice.message = "Expected ${0} to not be called exactly twice${2}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The number of calls, as a string. Ex: “two times”</dd>
    <dt>`${2}`:</dt>
    <dd>The call log. All calls as a string. Each line is one call and includes passed arguments, returned value and more</dd>
</dl>

### `calledThrice()`

```js
assert.calledThrice(spy);
```

Only passes if the `spy` has been called exactly three times.

```js
var spy = this.spy();

assert.calledThrice(spy); // Fails

spy();
assert.calledThrice(spy); // Fails

spy();
assert.calledThrice(spy); // Fails

spy();
assert.calledThrice(spy); // Passes

spy();
assert.calledThrice(spy); // Fails
```

#### Messages

```js
assert.calledThrice.message =
  "Expected ${0} to be called thrice but was called ${1}${2}";
refute.calledThrice.message =
  "Expected ${0} to not be called exactly thrice${2}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The number of calls, as a string. Ex: “two times”</dd>
    <dt>`${2}`:</dt>
    <dd>The call log. All calls as a string. Each line is one call and includes passed arguments, returned value and more</dd>
</dl>

### `calledOn()`

```js
assert.calledOn(spy, obj);
```

Passes if the `spy` was called at least once with `obj` as its `this` value.

```js
var spy = this.spy();
var obj1 = {};
var obj2 = {};
var obj3 = {};

spy.call(obj2);
spy.call(obj3);

assert.calledOn(spy, obj1); // Fails
assert.calledOn(spy, obj2); // Passes
assert.calledOn(spy, obj3); // Passes
```

#### Messages

```js
assert.calledOn.message =
  "Expected ${0} to be called with ${1} as this but was called on ${2}";
refute.calledOn.message = "Expected ${0} not to be called with ${1} as this";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The object obj which is expected to have been this at least once</dd>
    <dt>`${2}`:</dt>
    <dd>List of objects which actually have been `this`</dd>
</dl>

### `alwaysCalledOn()`

```js
assert.alwaysCalledOn(spy, obj);
```

Passes if the `spy` was always called with `obj` as its `this` value.

```js
var spy1 = this.spy();
var spy2 = this.spy();
var obj1 = {};
var obj2 = {};

spy1.call(obj1);
spy1.call(obj2);

spy2.call(obj2);
spy2.call(obj2);

assert.alwaysCalledOn(spy1, obj1); // Fails
assert.alwaysCalledOn(spy1, obj2); // Fails
assert.alwaysCalledOn(spy2, obj1); // Fails
assert.alwaysCalledOn(spy2, obj2); // Passes
```

#### Messages

```js
assert.alwaysCalledOn.message =
  "Expected ${0} to always be called with ${1} as this but was called on ${2}";
refute.alwaysCalledOn.message =
  "Expected ${0} not to always be called with ${1} as this";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The object obj which is expected always to have been `this`</dd>
    <dt>`${2}`:</dt>
    <dd>List of objects which actually have been `this`</dd>
</dl>

### `calledWith()`

```js
assert.calledWith(spy, arg1, arg2, ...)
```

Passes if the `spy` was called at least once with the specified arguments. Other arguments may have been passed after the specified ones.

```js
var spy = this.spy();
var arr = [1, 2, 3];
spy(12);
spy(42, 13);
spy("Hey", arr, 2);

assert.calledWith(spy, 12); // Passes
assert.calledWith(spy, "Hey"); // Passes
assert.calledWith(spy, "Hey", 12); // Fails
assert.calledWith(spy, "Hey", arr); // Passes
```

#### Messages

```js
assert.calledWith.message =
  "Expected ${0} to be called with arguments ${1}${2}";
refute.calledWith.message =
  "Expected ${0} not to be called with arguments ${1}${2}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The expected arguments</dd>
    <dt>`${2}`:</dt>
    <dd>String representation of all calls</dd>
</dl>

### `calledWithNew()`

```js
assert.calledWithNew(spy);
```

Fails if the `spy` has never called with `new`.

```js
var spy = this.spy();

assert.calledWithNew(spy); // Fails

new spy();
assert.calledWithNew(spy); // Passes

spy();
assert.calledWithNew(spy); // Passes
```

#### Messages

```js
assert.calledWithNew.message =
  "Expected ${spyObj} to be called with 'new' at least once but was never called with 'new'";
refute.calledWithNew.message = "Expected ${spyObj} to not be called with 'new'";
```

<dl>
    <dt>`${spyObj}`:</dt>
    <dd>The spy</dd>
</dl>

### `alwaysCalledWith()`

```js
assert.alwaysCalledWith(spy, arg1, arg2, ...)
```

Passes if the `spy` was always called with the specified arguments. Other arguments may have been passed after the specified ones.

```js
var spy = this.spy();
var arr = [1, 2, 3];
spy("Hey", arr, 12);
spy("Hey", arr, 13);

assert.alwaysCalledWith(spy, "Hey"); // Passes
assert.alwaysCalledWith(spy, "Hey", arr); // Passes
assert.alwaysCalledWith(spy, "Hey", arr, 12); // Fails
```

#### Messages

```js
assert.alwaysCalledWith.message =
  "Expected ${0} to always be called with arguments ${1}${2}";
refute.alwaysCalledWith.message =
  "Expected ${0} not to always be called with arguments${1}${2}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The expected arguments</dd>
    <dt>`${2}`:</dt>
    <dd>String representation of all calls</dd>
</dl>

### `alwaysCalledWithNew()`

```js
assert.alwaysCalledWithNew(spy);
```

Passes when the `spy` has was always called with `new`

```js
var spy = this.spy();

assert.alwaysCalledWithNew(spy); // Fails

new spy();
assert.alwaysCalledWithNew(spy); // Passes

spy();
assert.alwaysCalledWithNew(spy); // Fails
```

#### Messages

```js
assert.calledWithNew.message =
  "Expected ${spyObj} to always be called with 'new'";
refute.calledWithNew.message =
  "Expected ${spyObj} to not always be called with 'new'";
```

<dl>
    <dt>`${spyObj}`:</dt>
    <dd>The spy</dd>
</dl>

### `calledOnceWith()`

```js
assert.calledOnceWith(spy, arg1, arg2, ...)
```

Passes if the `spy` was called exactly once and with the specified arguments. Other arguments may have been passed after the specified ones.

```js
var spy = this.spy();
var arr = [1, 2, 3];
spy(12);

assert.calledOnceWith(spy, 12); // Passes
assert.calledOnceWith(spy, 42); // Fails

spy(42, 13);
assert.calledOnceWith(spy, 42, 13); // Fails
```

#### Messages

```js
assert.calledOnceWith.message =
  "Expected ${0} to be called once with arguments ${1}${2}";
refute.calledOnceWith.message =
  "Expected ${0} not to be called once with arguments ${1}${2}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The expected arguments</dd>
    <dt>`${2}`:</dt>
    <dd>String representation of all calls</dd>
</dl>

### `calledWithExactly()`

```js
assert.calledWithExactly(spy, arg1, arg2, ...)
```

Passes if the `spy` was called at least once with exactly the arguments specified.

```js
var spy = this.spy();
var arr = [1, 2, 3];
spy("Hey", arr, 12);
spy("Hey", arr, 13);

assert.calledWithExactly(spy, "Hey", arr, 12); // Passes
assert.calledWithExactly(spy, "Hey", arr, 13); // Passes
assert.calledWithExactly(spy, "Hey", arr); // Fails
assert.calledWithExactly(spy, "Hey"); // Fails
```

#### Messages

```js
assert.calledWithExactly.message =
  "Expected ${0} to be called with exact arguments ${1}${2}";
refute.calledWithExactly.message =
  "Expected ${0} not to be called with exact arguments${1}${2}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The expected arguments</dd>
    <dt>`${2}`:</dt>
    <dd>String representation of all calls</dd>
</dl>

### `alwaysCalledWithExactly()`

```js
assert.alwaysCalledWithExactly(spy, arg1, arg2, ...)
```

Passes if the `spy` was always called with exactly the arguments specified.

```js
var spy = this.spy();
var arr = [1, 2, 3];
spy("Hey", arr, 12);

assert.alwaysCalledWithExactly(spy, "Hey", arr, 12); // Passes
assert.alwaysCalledWithExactly(spy, "Hey", arr); // Fails
assert.alwaysCalledWithExactly(spy, "Hey"); // Fails

spy("Hey", arr, 13);
assert.alwaysCalledWithExactly(spy, "Hey", arr, 12); // Fails
```

#### Messages

```js
assert.alwaysCalledWithExactly.message =
  "Expected ${0} to always be called with exact arguments ${1}${2}";
refute.alwaysCalledWithExactly.message =
  "Expected ${0} not to always be called with exact arguments${1}${2}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The expected arguments</dd>
    <dt>`${2}`:</dt>
    <dd>String representation of all calls</dd>
</dl>

### `threw()`

```js
assert.threw(spy[, exception])
```

Passes if the `spy` threw at least once the specified `exception`. The `exception` can be a string denoting its type, or an actual object. If `exception` is not specified, the assertion passes if the `spy` ever threw any exception.

```js
var exception1 = new TypeError();
var exception2 = new TypeError();
var exception3 = new TypeError();
var spy = this.spy(function(exception) {
    throw exception;
});

function callAndCatchException(spy, exception) {
    try {
        spy(exception);
    } catch(e) {
    }
}

callAndCatchException(spy, exception1);
callAndCatchException(spy, exception2);

assert.threw(spy); // Passes
assert.threw(spy, “TypeError”); // Passes
assert.threw(spy, exception1); // Passes
assert.threw(spy, exception2); // Passes
assert.threw(spy, exception3); // Fails

callAndCatchException(spy, exception3); assert.threw(spy, exception3); // Passes
```

#### Messages

```js
assert.threw.message = "Expected ${0} to throw an exception${1}";
refute.threw.message = "Expected ${0} not to throw an exception${1}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The expected exception</dd>
</dl>

### `alwaysThrew()`

```js
assert.alwaysThrew(spy[, exception])
```

Passes if the `spy` always threw the specified `exception`. The `exception` can be a string denoting its type, or an actual object. If `exception` is not specified, the assertion passes if the `spy` ever threw any exception.

```js
var exception1 = new TypeError();
var exception2 = new TypeError();
var spy = this.spy(function(exception) {
    throw exception;
});

function callAndCatchException(spy, exception) {
    try {
        spy(exception);
    } catch(e) {

    }
}

callAndCatchException(spy, exception1);
assert.alwaysThrew(spy); // Passes
assert.alwaysThrew(spy, “TypeError”); // Passes
assert.alwaysThrew(spy, exception1); // Passes

callAndCatchException(spy, exception2);
assert.alwaysThrew(spy); // Passes
assert.alwaysThrew(spy, “TypeError”); // Passes
assert.alwaysThrew(spy, exception1); // Fails
```

#### Messages

```js
assert.alwaysThrew.message = "Expected ${0} to always throw an exception${1}";
refute.alwaysThrew.message =
  "Expected ${0} not to always throw an exception${1}";
```

<dl>
    <dt>`${0}`:</dt>
    <dd>The spy</dd>
    <dt>`${1}`:</dt>
    <dd>The expected exception</dd>
</dl>
