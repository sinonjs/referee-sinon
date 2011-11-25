/*jslint onevar: false, eqeqeq: false*/
/*global require*/
if (typeof require != "undefined") {
    var sinon = require("sinon");

    var buster = {
        assertions: require("buster-assertions"),
        format: require("buster-format"),
        testRunner: require("buster-test").testRunner,
        stackFilter: require("buster-test").stackFilter
    };
}

if (buster.stackFilter && buster.stackFilter.filters) {
    buster.stackFilter.filters.push("lib/sinon");
}

(function (ba) {
    buster.testRunner.onCreate(function (runner) {
        runner.on("test:setUp", function (test) {
            var config = sinon.getConfig(sinon.config);
            config.useFakeServer = false;
            var sandbox = sinon.sandbox.create();
            sandbox.inject(test.testCase);

            test.testCase.useFakeTimers = function () {
                return sandbox.useFakeTimers.apply(sandbox, arguments);
            };

            test.testCase.sandbox = sandbox;
            var testFunc = test.func;
        });

        runner.on("test:tearDown", function (test) {
            try {
                test.testCase.sandbox.verifyAndRestore();
            } catch (e) {
                runner.error(e, test);
            }
        });
    });

    sinon.format = buster.format.ascii;

    // Sinon assertions for buster
    function verifyFakes() {
        var method, isNot;

        for (var i = 0, l = arguments.length; i < l; ++i) {
            method = arguments[i];
            isNot = (method || "fake") + " is not ";

            if (!method) ba.fail(isNot + "a spy");
            if (typeof method != "function") ba.fail(isNot + "a function");
            if (typeof method.getCall != "function") ba.fail(isNot + "stubbed");
        }
    }

    var sf = sinon.spy.formatters;
    var spyValues = function (spy) { return [spy, sf.c(spy), sf.C(spy)]; };

    ba.add("called", {
        assert: function (spy) {
            verifyFakes(spy);
            return spy.called;
        },
        assertMessage: "expected ${1} to be called at least once but was never called",
        refuteMessage: "expected ${1} to not be called but was called ${2}${3}",
        expectation: "toBeCalled",
        values: spyValues
    });

    function slice(arr, from, to) {
        return [].slice.call(arr, from, to);
    }

    ba.assert.callOrder = function () {
        ba.count();
        verifyFakes.apply(this, arguments);

        if (!sinon.calledInOrder(arguments)) {
            try {
                expected = [].join.call(arguments, ", ");
                actual = sinon.orderByFirstCall(slice(arguments)).join(", ");
            } catch (e) {}

            failAssertion(this, "expected " + expected + " to be " +
                          "called in order but were called as " + actual);
        } else {
            assert.pass("callOrder");
        }


    };

    function addCallCountAssertion(count) {
        var c = count.toLowerCase();

        ba.add("called" + count, {
            assert: function (spy) {
                verifyFakes(spy);
                return spy["called" + count];
            },
            assertMessage: "expected ${1} to be called " + c + " but was called ${2}${3}",
            refuteMessage: "expected ${1} to not be called exactly " + c + "${3}",
            expectation: "toBeCalled" + count,
            values: spyValues
        });
    }

    addCallCountAssertion("Once");
    addCallCountAssertion("Twice");
    addCallCountAssertion("Thrice");

    ba.add("calledOn", {
        assert: function (spy, thisObj) {
            verifyFakes(spy);
            return spy.calledOn(thisObj);
        },
        assertMessage: "expected ${1} to be called with ${2} as this but was called with ${3}",
        refuteMessage: "expected ${1} not to be called with ${2} as this",
        expectation: "toBeCalledOn",
        values: function (spy, thisObj) { return [spy, thisObj, spy.printf("%t")]; }
    });

    ba.add("alwaysCalledOn", {
        assert: function (spy, thisObj) {
            verifyFakes(spy);
            return spy.alwaysCalledOn(thisObj);
        },
        assertMessage: "expected ${1} to always be called with ${2} as this but was called with ${3}",
        refuteMessage: "expected ${1} not to always be called with ${2} as this",
        expectation: "toAlwaysBeCalledOn",
        values: function (spy, thisObj) { return [spy, thisObj, spy.printf("%t")]; }
    });

    ba.add("calledWith", {
        assert: function (spy) {
            verifyFakes(spy);
            return spy.calledWith.apply(spy, slice(arguments, 1));
        },
        assertMessage: "expected ${1} to be called with arguments ${2}${3}",
        refuteMessage: "expected ${1} not to be called with arguments${2}${3}",
        expectation: "toBeCalledWith",
        values: function (spy) { return [spy, slice(arguments, 1), spy.printf("%C")]; }
    });

    ba.add("alwaysCalledWith", {
        assert: function (spy) {
            verifyFakes(spy);
            return spy.alwaysCalledWith.apply(spy, slice(arguments, 1));
        },
        assertMessage: "expected ${1} to always be called with arguments ${2}${3}",
        refuteMessage: "expected ${1} not to always be called with arguments${2}${3}",
        expectation: "toAlwaysBeCalledWith",
        values: function (spy) { return [spy, slice(arguments, 1), spy.printf("%C")]; }
    });

    ba.add("calledWithExactly", {
        assert: function (spy) {
            verifyFakes(spy);
            return spy.calledWithExactly.apply(spy, slice(arguments, 1));
        },
        assertMessage: "expected ${1} to be called with exact arguments ${2}${3}",
        refuteMessage: "expected ${1} not to be called with exact arguments${2}${3}",
        expectation: "toBeCalledWithExactly",
        values: function (spy) { return [spy, slice(arguments, 1), spy.printf("%C")]; }
    });

    ba.add("alwaysCalledWithExactly", {
        assert: function (spy) {
            verifyFakes(spy);
            return spy.alwaysCalledWithExactly.apply(spy, slice(arguments, 1));
        },
        assertMessage: "expected ${1} to always be called with exact arguments ${2}${3}",
        refuteMessage: "expected ${1} not to always be called with exact arguments${2}${3}",
        expectation: "toAlwaysBeCalledWithExactly",
        values: function (spy) { return [spy, slice(arguments, 1), spy.printf("%C")]; }
    });

    ba.add("threw", {
        assert: function (spy, exception) {
            verifyFakes(spy);
            return spy.threw(exception);
        },
        assertMessage: "expected ${1} to throw an exception${2}",
        refuteMessage: "expected ${1} not to throw an exception${2}",
        expectation: "toHaveThrown",
        values: function (spy, exception) { return [spy, spy.printf("%C")]; }
    });

    ba.add("alwaysThrew", {
        assert: function (spy, exception) {
            verifyFakes(spy);
            return spy.alwaysThrew(exception);
        },
        assertMessage: "expected ${1} to always throw an exception${2}",
        refuteMessage: "expected ${1} not to always throw an exception${2}",
        expectation: "toAlwaysHaveThrown",
        values: function (spy, exception) { return [spy, spy.printf("%C")]; }
    });
}(buster.assertions));
