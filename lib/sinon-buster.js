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

    ba.add("called", function (spy) {
        verifyFakes(spy);
        return spy.called;
    }, {
        assertFail: "expected ${1} to be called at least once but was never called",
        refuteFail: "expected ${1} to not be called but was called ${2}${3}",
        expect: "toBeCalled",
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

        ba.add("called" + count, function (spy) {
            verifyFakes(spy);
            return spy["called" + count];
        }, {
            assertFail: "expected ${1} to be called " + c + " but was called ${2}${3}",
            refuteFail: "expected ${1} to not be called exactly " + c + "${3}",
            expect: "toBeCalled" + count,
            values: spyValues
        });
    }

    addCallCountAssertion("Once");
    addCallCountAssertion("Twice");
    addCallCountAssertion("Thrice");

    ba.add("calledOn", function (spy, thisObj) {
        verifyFakes(spy);
        return spy.calledOn(thisObj);
    }, {
        assertFail: "expected ${1} to be called with ${2} as this but was called with ${3}",
        refuteFail: "expected ${1} not to be called with ${2} as this",
        expect: "toBeCalledOn",
        values: function (spy, thisObj) { return [spy, thisObj, spy.printf("%t")]; }
    });

    ba.add("alwaysCalledOn", function (spy, thisObj) {
        verifyFakes(spy);
        return spy.alwaysCalledOn(thisObj);
    }, {
        assertFail: "expected ${1} to always be called with ${2} as this but was called with ${3}",
        refuteFail: "expected ${1} not to always be called with ${2} as this",
        expect: "toAlwaysBeCalledOn",
        values: function (spy, thisObj) { return [spy, thisObj, spy.printf("%t")]; }
    });

    ba.add("calledWith", function (spy) {
        verifyFakes(spy);
        return spy.calledWith.apply(spy, slice(arguments, 1));
    }, {
        assertFail: "expected ${1} to be called with arguments ${2}${3}",
        refuteFail: "expected ${1} not to be called with arguments${2}${3}",
        expect: "toBeCalledWith",
        values: function (spy) { return [spy, slice(arguments, 1), spy.printf("%C")]; }
    });

    ba.add("alwaysCalledWith", function (spy) {
        verifyFakes(spy);
        return spy.alwaysCalledWith.apply(spy, slice(arguments, 1));
    }, {
        assertFail: "expected ${1} to always be called with arguments ${2}${3}",
        refuteFail: "expected ${1} not to always be called with arguments${2}${3}",
        expect: "toAlwaysBeCalledWith",
        values: function (spy) { return [spy, slice(arguments, 1), spy.printf("%C")]; }
    });

    ba.add("calledWithExactly", function (spy) {
        verifyFakes(spy);
        return spy.calledWithExactly.apply(spy, slice(arguments, 1));
    }, {
        assertFail: "expected ${1} to be called with exact arguments ${2}${3}",
        refuteFail: "expected ${1} not to be called with exact arguments${2}${3}",
        expect: "toBeCalledWithExactly",
        values: function (spy) { return [spy, slice(arguments, 1), spy.printf("%C")]; }
    });

    ba.add("alwaysCalledWithExactly", function (spy) {
        verifyFakes(spy);
        return spy.alwaysCalledWithExactly.apply(spy, slice(arguments, 1));
    }, {
        assertFail: "expected ${1} to always be called with exact arguments ${2}${3}",
        refuteFail: "expected ${1} not to always be called with exact arguments${2}${3}",
        expect: "toAlwaysBeCalledWithExactly",
        values: function (spy) { return [spy, slice(arguments, 1), spy.printf("%C")]; }
    });

    ba.add("threw", function (spy, exception) {
        verifyFakes(spy);
        return spy.threw(exception);
    }, {
        assertFail: "expected ${1} to throw an exception${2}",
        refuteFail: "expected ${1} not to throw an exception${2}",
        expect: "toHaveThrown",
        values: function (spy, exception) { return [spy, spy.printf("%C")]; }
    });

    ba.add("alwaysThrew", function (spy, exception) {
        verifyFakes(spy);
        return spy.alwaysThrew(exception);
    }, {
        assertFail: "expected ${1} to always throw an exception${2}",
        refuteFail: "expected ${1} not to always throw an exception${2}",
        expect: "toAlwaysHaveThrown",
        values: function (spy, exception) { return [spy, spy.printf("%C")]; }
    });
}(buster.assertions));
