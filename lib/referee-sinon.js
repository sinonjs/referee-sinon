"use strict";

var inspect = require("util").inspect;
var slice = require("@sinonjs/commons").prototypes.array.slice;
var calledInOrder = require("@sinonjs/commons").calledInOrder;
var orderByFirstCall = require("@sinonjs/commons").orderByFirstCall;
var referee = require("@sinonjs/referee");
var sinon = require("sinon");

var timesInWords = [null, "once", "twice", "thrice"];

function callCount(fake) {
    var count = fake ? fake.callCount : 0;
    return timesInWords[count] || (count || 0) + " times";
}

function callsToString(fake) {
    if (!fake || typeof fake.getCalls !== "function") {
        return "";
    }

    var calls = fake.getCalls();
    if (calls.length === 0) {
        return "";
    }

    return (
        "\n" +
        calls
            .map(function(call) {
                return "    " + call.toString();
            })
            .join("\n")
    );
}

sinon.expectation.pass = function(assertion) {
    referee.emit("pass", assertion);
};

sinon.expectation.fail = function(message) {
    referee.fail(message);
};

function format(object) {
    if (object instanceof Error) {
        return object.name;
    }
    return inspect(object);
}

sinon.setFormatter(format);

function verifyFakes() {
    var method, isNot, i, l;

    for (i = 0, l = arguments.length; i < l; ++i) {
        method = arguments[i];
        isNot = (method || "fake") + " is not ";

        if (!method) {
            this.fail(isNot + "a spy");
        }
        if (typeof method.calledWith !== "function") {
            this.fail(isNot + "stubbed");
        }
    }

    return true;
}

referee.add("callCount", {
    assert: function(spy, count) {
        verifyFakes.call(this, spy);
        return spy.callCount === count;
    },
    assertMessage:
        "Expected ${spyObj} to be called exactly ${expectedTimes} times, but was called ${!actualTimes}",
    refuteMessage:
        "Expected ${spyObj} to not be called exactly ${expectedTimes} times",
    expectation: "toHaveCallCount",
    values: function(spyObj, count) {
        return {
            spyObj: spyObj,
            actualTimes: callCount(spyObj),
            expectedTimes: count
        };
    }
});

referee.add("called", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.called;
    },
    assertMessage:
        "Expected ${spyObj} to be called at least once but was never called",
    refuteMessage:
        "Expected ${spyObj} to not be called but was called ${times}${calls}",
    expectation: "toHaveBeenCalled",
    values: function(spyObj) {
        return {
            spyObj: spyObj,
            times: callCount(spyObj),
            calls: callsToString(spyObj)
        };
    }
});

referee.add("calledWithNew", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.calledWithNew();
    },
    assertMessage:
        "Expected ${spyObj} to be called with 'new' at least once but was never called with 'new'",
    refuteMessage: "Expected ${spyObj} to not be called with 'new'",
    expectation: "toHaveBeenCalledWithNew",
    values: function(spyObj) {
        return {
            spyObj: spyObj
        };
    }
});

referee.add("alwaysCalledWithNew", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.alwaysCalledWithNew();
    },
    assertMessage: "Expected ${spyObj} to always be called with 'new'",
    refuteMessage: "Expected ${spyObj} to not always be called with 'new'",
    expectation: "toAlwaysHaveBeenCalledWithNew",
    values: function(spyObj) {
        return {
            spyObj: spyObj
        };
    }
});

referee.add("callOrder", {
    assert: function(spy) {
        var type = Object.prototype.toString.call(spy);
        var isArray = type === "[object Array]";
        var args = isArray ? spy : arguments;
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
    refuteMessage: "Expected ${!expected} not to be called in order"
});

function addCallCountAssertion(count) {
    referee.add("called" + count, {
        assert: function(spy) {
            verifyFakes.call(this, spy);
            return spy["called" + count];
        },
        assertMessage:
            "Expected ${spyObj} to be called ${!expectedTimes} but was called ${!times}${!calls}",
        refuteMessage:
            "Expected ${spyObj} to not be called exactly ${!expectedTimes}${!calls}",
        expectation: "toHaveBeenCalled" + count,
        values: function(spyObj) {
            return {
                spyObj: spyObj,
                expectedTimes: count.toLowerCase(),
                times: callCount(spyObj),
                calls: callsToString(spyObj)
            };
        }
    });
}

addCallCountAssertion("Once");
addCallCountAssertion("Twice");
addCallCountAssertion("Thrice");

function valuesWithThis(spyObj, expectedThis) {
    return {
        spyObj: spyObj,
        expectedThis: expectedThis,
        actualThis: spyObj && spyObj.printf ? spyObj.printf("%t") : ""
    };
}

referee.add("calledOn", {
    assert: function(spy, thisObj) {
        verifyFakes.call(this, spy);
        return spy.calledOn(thisObj);
    },
    assertMessage:
        "Expected ${spyObj} to be called with ${expectedThis} as this but was called on ${!actualThis}",
    refuteMessage:
        "Expected ${spyObj} not to be called with ${expectedThis} as this",
    expectation: "toHaveBeenCalledOn",
    values: valuesWithThis
});

referee.add("alwaysCalledOn", {
    assert: function(spy, thisObj) {
        verifyFakes.call(this, spy);
        return spy.alwaysCalledOn(thisObj);
    },
    assertMessage:
        "Expected ${spyObj} to always be called with ${expectedThis} as this but was called on ${!actualThis}",
    refuteMessage:
        "Expected ${spyObj} not to always be called with ${expectedThis} as this",
    expectation: "toHaveAlwaysBeenCalledOn",
    values: valuesWithThis
});

function spyAndCalls(spyObj) {
    var expected = slice(arguments, 1);
    var actual = spyObj && spyObj.printf ? spyObj.printf("%C") : "";
    return {
        spyObj: spyObj,
        actual: actual,
        expected: expected
    };
}

referee.add("calledWith", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.calledWith.apply(spy, slice(arguments, 1));
    },
    assertMessage:
        "Expected ${spyObj} to be called with arguments ${...expected}${!actual}",
    refuteMessage:
        "Expected ${spyObj} not to be called with arguments ${...expected}${!actual}",
    expectation: "toHaveBeenCalledWith",
    values: spyAndCalls
});

referee.add("alwaysCalledWith", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.alwaysCalledWith.apply(spy, slice(arguments, 1));
    },
    assertMessage:
        "Expected ${spyObj} to always be called with arguments ${...expected}${!actual}",
    refuteMessage:
        "Expected ${spyObj} not to always be called with arguments ${...expected}${!actual}",
    expectation: "toHaveAlwaysBeenCalledWith",
    values: spyAndCalls
});

referee.add("calledOnceWith", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.calledOnce && spy.calledWith.apply(spy, slice(arguments, 1));
    },
    assertMessage:
        "Expected ${spyObj} to be called once with arguments ${...expected}${!actual}",
    refuteMessage:
        "Expected ${spyObj} not to be called once with arguments ${...expected}${!actual}",
    expectation: "toHaveBeenCalledOnceWith",
    values: spyAndCalls
});

referee.add("calledWithExactly", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.calledWithExactly.apply(spy, slice(arguments, 1));
    },
    assertMessage:
        "Expected ${spyObj} to be called with exact arguments ${...expected}${!actual}",
    refuteMessage:
        "Expected ${spyObj} not to be called with exact arguments ${...expected}${!actual}",
    expectation: "toHaveBeenCalledWithExactly",
    values: spyAndCalls
});

referee.add("alwaysCalledWithExactly", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.alwaysCalledWithExactly.apply(spy, slice(arguments, 1));
    },
    assertMessage:
        "Expected ${spyObj} to always be called with exact arguments ${...expected}${!actual}",
    refuteMessage:
        "Expected ${spyObj} not to always be called with exact arguments ${...expected}${!actual}",
    expectation: "toHaveAlwaysBeenCalledWithExactly",
    values: spyAndCalls
});

referee.add("calledOnceWithExactly", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.calledOnceWithExactly.apply(spy, slice(arguments, 1));
    },
    assertMessage:
        "Expected ${spyObj} to be called once with exact arguments ${...expected}${!actual}",
    refuteMessage:
        "Expected ${spyObj} not to be called once with exact arguments ${...expected}${!actual}",
    expectation: "toHaveBeenCalledOnceWithExactly",
    values: spyAndCalls
});

referee.add("calledWithMatch", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.calledWithMatch.apply(spy, slice(arguments, 1));
    },
    assertMessage:
        "Expected ${spyObj} to be called with matching arguments ${...expected}${!actual}",
    refuteMessage:
        "Expected ${spyObj} not to be called with matching arguments ${...expected}${!actual}",
    expectation: "toHaveBeenCalledWithMatch",
    values: spyAndCalls
});

referee.add("calledOnceWithMatch", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.calledOnceWithMatch.apply(spy, slice(arguments, 1));
    },
    assertMessage:
        "Expected ${spyObj} to be called once with matching arguments ${...expected}${!actual}",
    refuteMessage:
        "Expected ${spyObj} not to be called once with matching arguments ${...expected}${!actual}",
    expectation: "toHaveBeenCalledOnceWithMatch",
    values: spyAndCalls
});

referee.add("alwaysCalledWithMatch", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.alwaysCalledWithMatch.apply(spy, slice(arguments, 1));
    },
    assertMessage:
        "Expected ${spyObj} to always be called with matching arguments ${...expected}${!actual}",
    refuteMessage:
        "Expected ${spyObj} not to always be called with matching arguments ${...expected}${!actual}",
    expectation: "toHaveAlwaysBeenCalledWithMatch",
    values: spyAndCalls
});

function spyAndException(spyObj, exception) {
    return {
        spyObj: spyObj,
        actual: spyObj && spyObj.printf ? spyObj.printf("%C") : "",
        exception: exception // note: not actually used
    };
}

referee.add("threw", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.threw(arguments[1]);
    },
    assertMessage: "Expected ${spyObj} to throw an exception${!actual}",
    refuteMessage: "Expected ${spyObj} not to throw an exception${!actual}",
    expectation: "toHaveThrown",
    values: spyAndException
});

referee.add("alwaysThrew", {
    assert: function(spy) {
        verifyFakes.call(this, spy);
        return spy.alwaysThrew(arguments[1]);
    },
    assertMessage: "Expected ${spyObj} to always throw an exception${!actual}",
    refuteMessage:
        "Expected ${spyObj} not to always throw an exception${!actual}",
    expectation: "toAlwaysHaveThrown",
    values: spyAndException
});

referee.sinon = sinon;

module.exports = referee;
