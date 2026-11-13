/* eslint-disable jsdoc/require-jsdoc */
"use strict";

const slice = require("@sinonjs/commons").prototypes.array.slice;
const calledInOrder = require("@sinonjs/commons").calledInOrder;
const orderByFirstCall = require("@sinonjs/commons").orderByFirstCall;
const referee = require("@sinonjs/referee");
const sinon = require("sinon");

const argsAsString = require("./args-as-string");

const timesInWords = [null, "once", "twice", "thrice"];

function callCount(fake) {
  const count = fake ? fake.callCount : 0;
  return timesInWords[count] || `${count || 0} times`;
}

function callsToString(fake) {
  if (!fake || typeof fake.getCalls !== "function") {
    return "";
  }

  const calls = fake.getCalls();
  if (calls.length === 0) {
    return "";
  }

  return `\n${calls.map((call) => `    ${call.toString()}`).join("\n")}`;
}

sinon.expectation.pass = function (assertion) {
  referee.emit("pass", assertion);
};

sinon.expectation.fail = function (message) {
  referee.fail(message);
};

function verifyFakes() {
  let method, isNot, i, l;

  for (i = 0, l = arguments.length; i < l; ++i) {
    method = arguments[i];
    isNot = `${method || "fake"} is not `;

    if (!method) {
      this.fail(`${isNot}a spy`);
    }
    if (typeof method.calledWith !== "function") {
      this.fail(`${isNot}stubbed`);
    }
  }

  return true;
}

referee.add("callCount", {
  assert(spy, count) {
    verifyFakes.call(this, spy);
    return spy.callCount === count;
  },
  assertMessage:
    "Expected ${spyObj} to be called exactly ${expectedTimes} times, but was called ${!actualTimes}",
  refuteMessage:
    "Expected ${spyObj} to not be called exactly ${expectedTimes} times",
  expectation: "toHaveCallCount",
  values(spyObj, count) {
    return {
      spyObj,
      actualTimes: callCount(spyObj),
      expectedTimes: count,
    };
  },
});

referee.add("called", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.called;
  },
  assertMessage:
    "Expected ${spyObj} to be called at least once but was never called",
  refuteMessage:
    "Expected ${spyObj} to not be called but was called ${times}${calls}",
  expectation: "toHaveBeenCalled",
  values(spyObj) {
    return {
      spyObj,
      times: callCount(spyObj),
      calls: callsToString(spyObj),
    };
  },
});

referee.add("calledWithNew", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.calledWithNew();
  },
  assertMessage:
    "Expected ${spyObj} to be called with 'new' at least once but was never called with 'new'",
  refuteMessage: "Expected ${spyObj} to not be called with 'new'",
  expectation: "toHaveBeenCalledWithNew",
  values(spyObj) {
    return {
      spyObj,
    };
  },
});

referee.add("alwaysCalledWithNew", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.alwaysCalledWithNew();
  },
  assertMessage: "Expected ${spyObj} to always be called with 'new'",
  refuteMessage: "Expected ${spyObj} to not always be called with 'new'",
  expectation: "toAlwaysHaveBeenCalledWithNew",
  values(spyObj) {
    return {
      spyObj,
    };
  },
});

referee.add("callOrder", {
  assert(spy) {
    const type = Object.prototype.toString.call(spy);
    const isArray = type === "[object Array]";
    const args = isArray ? spy : arguments;
    verifyFakes.apply(this, args);
    if (calledInOrder(args)) {
      return true;
    }

    this.expected = slice(args).join(", ");
    this.actual = orderByFirstCall(slice(args)).join(", ");
    return false;
  },
  assertMessage:
    "Expected ${!expected} to be called in order but were called as ${!actual}",
  refuteMessage: "Expected ${!expected} not to be called in order",
});

function addCallCountAssertion(count) {
  referee.add(`called${count}`, {
    assert(spy) {
      verifyFakes.call(this, spy);
      return spy[`called${count}`];
    },
    assertMessage:
      "Expected ${spyObj} to be called ${!expectedTimes} but was called ${!times}${!calls}",
    refuteMessage:
      "Expected ${spyObj} to not be called exactly ${!expectedTimes}${!calls}",
    expectation: `toHaveBeenCalled${count}`,
    values(spyObj) {
      return {
        spyObj,
        expectedTimes: count.toLowerCase(),
        times: callCount(spyObj),
        calls: callsToString(spyObj),
      };
    },
  });
}

addCallCountAssertion("Once");
addCallCountAssertion("Twice");
addCallCountAssertion("Thrice");

function valuesWithThis(spyObj, expectedThis) {
  return {
    spyObj,
    expectedThis,
    actualThis: spyObj && spyObj.printf ? spyObj.printf("%t") : "",
  };
}

referee.add("calledOn", {
  assert(spy, thisObj) {
    verifyFakes.call(this, spy);
    return spy.calledOn(thisObj);
  },
  assertMessage:
    "Expected ${spyObj} to be called with ${expectedThis} as this but was called on ${!actualThis}",
  refuteMessage:
    "Expected ${spyObj} not to be called with ${expectedThis} as this",
  expectation: "toHaveBeenCalledOn",
  values: valuesWithThis,
});

referee.add("alwaysCalledOn", {
  assert(spy, thisObj) {
    verifyFakes.call(this, spy);
    return spy.alwaysCalledOn(thisObj);
  },
  assertMessage:
    "Expected ${spyObj} to always be called with ${expectedThis} as this but was called on ${!actualThis}",
  refuteMessage:
    "Expected ${spyObj} not to always be called with ${expectedThis} as this",
  expectation: "toHaveAlwaysBeenCalledOn",
  values: valuesWithThis,
});

function spyAndCalls(spyObj) {
  const expected = slice(arguments, 1);
  const actual = spyObj && spyObj.printf ? spyObj.printf("%C") : "";
  return {
    spyObj,
    actual,
    expected,
  };
}

referee.add("calledWith", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.calledWith.apply(spy, slice(arguments, 1));
  },
  assertMessage:
    "Expected ${spyObj} to be called with arguments ${...expected}${!actual}",
  refuteMessage:
    "Expected ${spyObj} not to be called with arguments ${...expected}${!actual}",
  expectation: "toHaveBeenCalledWith",
  values: spyAndCalls,
});

referee.add("alwaysCalledWith", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.alwaysCalledWith.apply(spy, slice(arguments, 1));
  },
  assertMessage:
    "Expected ${spyObj} to always be called with arguments ${...expected}${!actual}",
  refuteMessage:
    "Expected ${spyObj} not to always be called with arguments ${...expected}${!actual}",
  expectation: "toHaveAlwaysBeenCalledWith",
  values: spyAndCalls,
});

function createCalledOnceWith(ref) {
  let assertMessage;

  function assertFn(spy) {
    verifyFakes.call(this, spy);

    if (!spy.calledOnce) {
      assertMessage = `Expected \${spyObj} to be called once, but was called ${spy.callCount} times`;
      return false;
    }

    if (!spy.calledWith.apply(spy, slice(arguments, 1))) {
      assertMessage = `Expected \${spyObj} to be called with arguments \${...expected}, but was called with ${argsAsString(
        spy.args[0],
      )}`;
      return false;
    }

    return true;
  }

  function assertMessageFn() {
    return assertMessage;
  }

  ref.add("calledOnceWith", {
    assert: assertFn,
    assertMessage: assertMessageFn,
    refuteMessage:
      "Expected ${spyObj} not to be called once with ${...expected}",
    expectation: "toHaveBeenCalledOnceWith",
    values: spyAndCalls,
  });
}
createCalledOnceWith(referee);

referee.add("calledWithExactly", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.calledWithExactly.apply(spy, slice(arguments, 1));
  },
  assertMessage:
    "Expected ${spyObj} to be called with exact arguments ${...expected}${!actual}",
  refuteMessage:
    "Expected ${spyObj} not to be called with exact arguments ${...expected}${!actual}",
  expectation: "toHaveBeenCalledWithExactly",
  values: spyAndCalls,
});

referee.add("alwaysCalledWithExactly", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.alwaysCalledWithExactly.apply(spy, slice(arguments, 1));
  },
  assertMessage:
    "Expected ${spyObj} to always be called with exact arguments ${...expected}${!actual}",
  refuteMessage:
    "Expected ${spyObj} not to always be called with exact arguments ${...expected}${!actual}",
  expectation: "toHaveAlwaysBeenCalledWithExactly",
  values: spyAndCalls,
});

function createCalledOnceWithExactly(ref) {
  let assertMessage;

  function assertFn(spy) {
    verifyFakes.call(this, spy);

    if (!spy.calledOnce) {
      assertMessage = `Expected \${spyObj} to be called once, but was called ${spy.callCount} times`;
      return false;
    }

    if (!spy.calledWithExactly.apply(spy, slice(arguments, 1))) {
      assertMessage = `Expected \${spyObj} to be called once with exact arguments \${...expected}, but was called with ${argsAsString(
        spy.args[0],
      )}`;
      return false;
    }

    return true;
  }

  function assertMessageFn() {
    return assertMessage;
  }

  ref.add("calledOnceWithExactly", {
    assert: assertFn,
    assertMessage: assertMessageFn,
    refuteMessage:
      "Expected ${spyObj} not to be called once with exact arguments ${...expected}${!actual}",
    expectation: "toHaveBeenCalledOnceWithExactly",
    values: spyAndCalls,
  });
}
createCalledOnceWithExactly(referee);

referee.add("calledWithMatch", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.calledWithMatch.apply(spy, slice(arguments, 1));
  },
  assertMessage:
    "Expected ${spyObj} to be called with matching arguments ${...expected}${!actual}",
  refuteMessage:
    "Expected ${spyObj} not to be called with matching arguments ${...expected}${!actual}",
  expectation: "toHaveBeenCalledWithMatch",
  values: spyAndCalls,
});

function createCalledOnceWithMatch(ref) {
  let assertMessage;

  function assertFn(spy) {
    verifyFakes.call(this, spy);

    if (!spy.calledOnce) {
      assertMessage = `Expected \${spyObj} to be called once, but was called ${spy.callCount} times`;
      return false;
    }

    if (!spy.calledWithMatch.apply(spy, slice(arguments, 1))) {
      assertMessage = `Expected \${spyObj} to be called once with matching arguments \${...expected}, but was called with ${argsAsString(
        spy.args[0],
      )}`;
      return false;
    }

    return true;
  }

  function assertMessageFn() {
    return assertMessage;
  }

  ref.add("calledOnceWithMatch", {
    assert: assertFn,
    assertMessage: assertMessageFn,
    refuteMessage:
      "Expected ${spyObj} not to be called once with matching arguments ${...expected}${!actual}",
    expectation: "toHaveBeenCalledOnceWithMatch",
    values: spyAndCalls,
  });
}
createCalledOnceWithMatch(referee);

referee.add("alwaysCalledWithMatch", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.alwaysCalledWithMatch.apply(spy, slice(arguments, 1));
  },
  assertMessage:
    "Expected ${spyObj} to always be called with matching arguments ${...expected}${!actual}",
  refuteMessage:
    "Expected ${spyObj} not to always be called with matching arguments ${...expected}${!actual}",
  expectation: "toHaveAlwaysBeenCalledWithMatch",
  values: spyAndCalls,
});

function spyAndException(spyObj, exception) {
  return {
    spyObj,
    actual: spyObj && spyObj.printf ? spyObj.printf("%C") : "",
    exception, // note: not actually used
  };
}

referee.add("threw", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.threw(arguments[1]);
  },
  assertMessage: "Expected ${spyObj} to throw an exception${!actual}",
  refuteMessage: "Expected ${spyObj} not to throw an exception${!actual}",
  expectation: "toHaveThrown",
  values: spyAndException,
});

referee.add("alwaysThrew", {
  assert(spy) {
    verifyFakes.call(this, spy);
    return spy.alwaysThrew(arguments[1]);
  },
  assertMessage: "Expected ${spyObj} to always throw an exception${!actual}",
  refuteMessage:
    "Expected ${spyObj} not to always throw an exception${!actual}",
  expectation: "toAlwaysHaveThrown",
  values: spyAndException,
});

module.exports = referee;
module.exports.sinon = sinon;
module.exports.assert = referee.assert;
module.exports.refute = referee.refute;
module.exports.match = referee.match;
