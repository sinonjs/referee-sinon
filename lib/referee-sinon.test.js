"use strict";

var sinon = require("sinon");
var referee = require("referee");
var formatio = require("@sinonjs/formatio");

var sandbox = sinon.createSandbox();

var assert = referee.assert;
var refute = referee.refute;
var expect = referee.expect;

require("./referee-sinon")(referee, sinon);

var formatter = formatio.configure({ quoteStrings: false });

referee.format = function () {
    return formatter.ascii.apply(formatter, arguments);
};

function requiresFunction(assertion) {
    var args = [32, "dummy argument"].concat([].slice.call(arguments, 1));

    return function () {
        assert.exception(function () {
            assert[assertion].apply(assert, args);
        }, {message: "32 is not a function"});

        assert.exception(function () {
            refute[assertion].apply(assert, args);
        }, {message: "32 is not a function"});
    };
}

function requiresSpy(assertion) {
    var args = [function () {}, "dummy argument"].concat([].slice.call(arguments, 1));

    return function () {
        assert.exception(function () {
            assert[assertion].apply(assert, args);
        }, {message: "is not stubbed"});

        assert.exception(function () {
            refute[assertion].apply(assert, args);
        }, {message: "is not stubbed"});
    };
}

describe("referee-sinon", function () {
    afterEach(function () {
        sandbox.restore();
    });

    describe("mapping", function () {
        var DISALLOWED_METHODS = [
            "expose",
            "fail",
            // this can be achieved with refute.calledWith
            "neverCalledWith",
            // this can be achieved with refute.calledWithMatch
            "neverCalledWithMatch",
            // this can be achieved with refute.called
            "notCalled",
            "pass"
        ];
        var sinonMethods = Object.keys(sinon.assert).filter(function (key) {
            var isDisallowed = DISALLOWED_METHODS.indexOf(key) !== -1;
            var isFunction = typeof sinon.assert[key] === "function";

            return !isDisallowed && isFunction;
        });

        sinonMethods.forEach(function (methodName) {
            it("should map '" + methodName + "' from sinon.assert", function () {
                assert.isFunction(referee.assert[methodName]);
                assert.isFunction(referee.refute[methodName]);
            });
        });

        DISALLOWED_METHODS.forEach(function (methodName) {
            it("must not map disallowed '" + methodName + "' from sinon.assert", function () {
                refute.defined(referee.assert[methodName]);
                refute.defined(referee.refute[methodName]);
            });
        });
    });

    describe("assertions", function () {
        it("formats assert messages through referee", function () {
            sandbox.stub(referee, "format").returns("I'm the object");
            var message;
            var spy = sinon.spy();
            spy({ id: 42 });

            try {
                assert.calledWith(spy, 3);
            } catch (e) {
                message = e.message;
            }

            assert.match(message, "I'm the object");
        });

        describe("calledWith", function () {
            it("fails when not called with function", requiresFunction("calledWith"));
            it("fails when not called with spy", requiresSpy("calledWith"));

            it("passes when spy is explicitly passed null", function () {
                var spy = sinon.spy();
                spy(null, "Hey");

                refute.calledWith(spy, null, "Hey!");
            });

            it("formats message nicely", function () {
                var spy = sinon.spy();
                spy(null, 1, 2);

                try {
                    assert.calledWith(spy, null, 2, 2);
                } catch (e) {
                    var message = "[assert.calledWith] Expected function " +
                            "spy() {} to be called with arguments null, 2, 2" +
                            "\n    spy(null, 1, 2)";
                    assert.match(e.message, message);
                }
            });

            it("doesn't pass undefined to [].slice (IE8 doesn't like that)", function () {
                var spy = sinon.spy();
                spy("foo");
                sinon.spy(Array.prototype, "slice");

                assert.calledWith(spy, "foo");
                assert.calledWithExactly(Array.prototype.slice, 1);
            });
        });

        describe("calledWithExactly", function () {
            it("fails when not called with function", requiresFunction("calledWithExactly"));
            it("fails when not called with spy", requiresSpy("calledWithExactly"));

            it("passes when spy is explicitly passed null", function () {
                var spy = sinon.spy();
                spy(null, "Hey");

                refute.calledWithExactly(spy, null, "Hey!");
            });

            it("formats message nicely", function () {
                var spy = sinon.spy();
                spy(null, 1, 2);

                try {
                    assert.calledWithExactly(spy, null, 2, 2);
                } catch (e) {
                    var message = "[assert.calledWithExactly] Expected " +
                            "function spy() {} to be called with exact " +
                            "arguments null, 2, 2\n    spy(null, 1, 2)";
                    assert.match(e.message, message);
                }
            });
        });

        describe("calledWithMatch", function () {
            it("fails when not called with function", requiresFunction("calledWithMatch"));
            it("fails when not called with spy", requiresSpy("calledWithMatch"));

            it("passes when spy is passed matching object", function () {
                var spy = sinon.spy();
                spy({ check: 123 });

                refute.calledWithMatch(spy, { test: 123 });
            });

            it("formats message nicely", function () {
                var spy = sinon.spy();
                spy({ check: 123 });

                try {
                    assert.calledWithMatch(spy, { check: 321 });
                } catch (e) {
                    var message = "[assert.calledWithMatch] Expected " +
                            "function spy() {} to be called with matching " +
                            "arguments { check: 321 }\n    spy({ check: 123 })";
                    assert.match(e.message, message);
                }
            });
        });

        describe("alwaysCalledWithMatch", function () {
            it("fails when not called with function", requiresFunction("alwaysCalledWithMatch"));
            it("fails when not called with spy", requiresSpy("alwaysCalledWithMatch"));

            it("passes when spy is always passed matching object", function () {
                var spy = sinon.spy();
                spy({ check: 123 });
                spy({ check: 321 });

                refute.alwaysCalledWithMatch(spy, { test: 123 });
            });

            it("formats message nicely", function () {
                var spy = sinon.spy();
                spy({ check: 123 });
                spy({ check: 321 });

                try {
                    assert.alwaysCalledWithMatch(spy, { check: 321 });
                } catch (e) {
                    var message = "[assert.alwaysCalledWithMatch] Expected " +
                            "function spy() {} to always be called with " +
                            "matching arguments { check: 321 }";
                    assert.match(e.message, message);
                    var lines = e.message.split("\n");
                    assert.equals(lines.length, 3);
                    assert.match(lines[1], "    spy({ check: 123 })");
                    assert.match(lines[2], "    spy({ check: 321 })");
                }
            });
        });

        describe("calledOnce", function () {
            it("fails when not called with function", requiresFunction("calledOnce"));
            it("fails when not called with spy", requiresSpy("calledOnce"));

            it("passes when called once", function () {
                var spy = sinon.spy();
                spy(null, "Hey");

                assert.calledOnce(spy);
            });

            it("formats message nicely", function () {
                try {
                    assert.calledOnce(sinon.spy());
                } catch (e) {
                    var message = "[assert.calledOnce] Expected function " +
                            "spy() {} to be called once but was called 0 times";
                    assert.match(e.message, message);
                }
            });
        });

        describe("callCount", function () {
            it("fails when not called with function", requiresFunction("callCount"));
            it("fails when not called with spy", requiresSpy("callCount"));

            it("passes as callCount changes", function () {
                var spy = sinon.spy();

                for (var i = 1; i <= 100; i++) {
                    spy(null, "Hey");
                    assert.callCount(spy, i);
                }
            });

            it("formats message nicely", function () {
                try {
                    assert.callCount(sinon.spy(), 1);
                } catch (e) {
                    var message = "[assert.callCount] Expected function spy() {} to be called exactly 1 times, but was called 0 times";
                    assert.match(e.message, message);
                }
            });
        });

        describe("called", function () {
            it("fails when not called with function", requiresFunction("called"));
            it("fails when not called with spy", requiresSpy("called"));

            it("passes when called once", function () {
                var spy = sinon.spy();
                spy(null, "Hey");

                assert.called(spy);
            });

            it("formats message", function () {
                try {
                    assert.called(sinon.spy());
                } catch (e) {
                    var message = "[assert.called] Expected function spy() " +
                            "{} to be called at least once but was never " +
                            "called";
                    assert.equals(e.message, message);
                }
            });
        });

        describe("callOrder", function () {
            it("fails when not called with function", requiresFunction("callOrder"));
            it("fails when not called with spy", requiresSpy("callOrder"));

            it("passes when called in order", function () {
                var spies = [sinon.spy(), sinon.spy()];
                spies[0]();
                spies[1]();

                assert.callOrder(spies[0], spies[1]);
            });

            it("passes when called in order using an array", function () {
                var spies = [sinon.spy(), sinon.spy()];
                spies[0]();
                spies[1]();

                assert.callOrder(spies);
            });

            it("formats message", function () {
                var spies = [sinon.spy(), sinon.spy()];
                spies[1]();
                spies[0]();

                try {
                    assert.callOrder(spies[0], spies[1]);
                } catch (e) {
                    var message = "[assert.callOrder] Expected 0, 1 to be " +
                            "called in order but were called as 1, 0";
                    assert.equals(e.message, message);
                }
            });
        });

        describe("calledOn", function () {
            it("fails when not called with function", requiresFunction("calledOn", {}));
            it("fails when not called with spy", requiresSpy("calledOn", {}));

            it("passes when called on object", function () {
                var spy = sinon.spy();
                var object = { id: 42 };
                spy.call(object);

                assert.calledOn(spy, object);
            });

            it("formats message", function () {
                var spy = sinon.spy();
                var object = { id: 42 };
                spy.call(object);

                try {
                    assert.calledOn(spy, { id: 12 });
                } catch (e) {
                    var message = "[assert.calledOn] Expected function spy() " +
                            "{} to be called with { id: 12 } as this but was " +
                            "called on { id: 42 }";
                    assert.equals(e.message, message);
                }
            });
        });

        describe("alwaysCalledOn", function () {
            it("fails when not called with function", requiresFunction("alwaysCalledOn", {}));
            it("fails when not called with spy", requiresSpy("alwaysCalledOn", {}));

            it("passes when called on object", function () {
                var spy = sinon.spy();
                var object = { id: 42 };
                spy.call(object);

                assert.alwaysCalledOn(spy, object);
            });

            it("formats message", function () {
                var spy = sinon.spy();
                var object = { id: 42 };
                spy.call(object);

                try {
                    assert.alwaysCalledOn(spy, { id: 12 });
                } catch (e) {
                    var message = "[assert.alwaysCalledOn] Expected function " +
                            "spy() {} to always be called with { id: 12 } as " +
                            "this but was called on { id: 42 }";
                    assert.equals(e.message, message);
                }
            });
        });

        describe("alwaysCalledWith", function () {
            it("fails when not called with function", requiresFunction("alwaysCalledWith"));
            it("fails when not called with spy", requiresSpy("alwaysCalledWith"));

            it("passes when always called with same value", function () {
                var spy = sinon.spy();
                spy(42);
                spy(42);

                assert.alwaysCalledWith(spy, 42);
            });

            it("formats message", function () {
                var spy = sinon.spy();
                spy(42);

                try {
                    assert.alwaysCalledWith(spy, 12);
                } catch (e) {
                    var message = "[assert.alwaysCalledWith] Expected " +
                            "function spy() {} to always be called with " +
                            "arguments 12\n    spy(42)";
                    assert.match(e.message, message);
                }
            });
        });

        describe("alwaysCalledWithExactly", function () {
            it("fails when not called with function", requiresFunction("alwaysCalledWithExactly"));
            it("fails when not called with spy", requiresSpy("alwaysCalledWithExactly"));

            it("fails when spy is explicitly passed null", function () {
                var spy = sinon.spy();
                spy(null, "Hey");

                refute.alwaysCalledWithExactly(spy, null, "Hey!");
            });

            it("formats message nicely", function () {
                var spy = sinon.spy();
                spy(null, 1, 2);

                try {
                    assert.alwaysCalledWithExactly(spy, null, 2, 2);
                } catch (e) {
                    var message = "[assert.alwaysCalledWithExactly] Expected " +
                            "function spy() {} to always be called with " +
                            "exact arguments null, 2, 2\n    spy(null, 1, 2)";
                    assert.match(e.message, message);
                }
            });
        });

        describe("threw", function () {
            it("fails when not called with function", requiresFunction("threw"));
            it("fails when not called with spy", requiresSpy("threw"));

            it("passes when spy threw", function () {
                var spy = sandbox.stub().throws();
                try {
                    spy();
                // eslint-disable-next-line no-empty
                } catch (e) {}
                assert.threw(spy);
            });

            it("formats message nicely", function () {
                var spy = sinon.spy();

                try {
                    assert.threw(spy);
                } catch (e) {
                    var message = "[assert.threw] Expected function spy() " +
                            "{} to throw an exception";
                    assert.match(e.message, message);
                }
            });
        });

        describe("alwaysThrew", function () {
            it("fails when not called with function", requiresFunction("alwaysThrew"));
            it("fails when not called with spy", requiresSpy("alwaysThrew"));

            it("passes when spy always threw", function () {
                var spy = sandbox.stub().throws();
                try {
                    spy();
                // eslint-disable-next-line no-empty
                } catch (e) {}
                assert.alwaysThrew(spy);
            });

            it("formats message nicely", function () {
                var spy = sinon.spy();

                try {
                    assert.alwaysThrew(spy);
                } catch (e) {
                    var message = "[assert.alwaysThrew] Expected function " +
                            "spy() {} to always throw an exception";
                    assert.match(e.message, message);
                }
            });
        });

        describe("calledOnceWith", function () {
            it("fails when not called with function", requiresFunction("calledOnceWith"));
            it("fails when not called with spy", requiresSpy("calledOnceWith"));


            it("passes when called once with object", function () {
                var spy = sinon.spy();
                spy(42);

                assert.calledOnceWith(spy, 42);
            });

            it("fails when not called", function () {
                var spy = sinon.spy();
                refute.calledOnceWith(spy, 42);
            });

            it("fails when not called with argument", function () {
                var spy = sinon.spy();
                spy();
                refute.calledOnceWith(spy, 42);
            });

            it("fails when called twice", function () {
                var spy = sinon.spy();
                spy(42);
                spy(42);
                refute.calledOnceWith(spy, 42);
            });

            it("formats message", function () {
                var spy = sinon.spy();
                spy(42);

                try {
                    assert.calledOnceWith(spy, 12);
                } catch (e) {
                    var message = "[assert.calledOnceWith] Expected function " +
                            "spy() {} to be called once with arguments 12\n" +
                            "    spy(42)";
                    assert.match(e.message, message);
                }
            });
        });
    });

    describe("expectations", function () {
        it("toHaveBeenCalledWithMatch", function () {
            var stub = sandbox.stub(assert, "calledWithMatch");

            expect().toHaveBeenCalledWithMatch();

            assert.calledOnce(stub);
        });

        it("toHaveAlwaysBeenCalledWithMatch", function () {
            var stub = sandbox.stub(assert, "alwaysCalledWithMatch");

            expect().toHaveAlwaysBeenCalledWithMatch();

            assert.calledOnce(stub);
        });
    });

    describe("sinon assert failures", function () {
        it("delegates to referee.assert.fail", function () {
            sandbox.stub(referee, "fail");

            try {
                assert.calledOnce(sinon.spy());
            // eslint-disable-next-line no-empty
            } catch (e) {}

            assert(referee.fail.calledOnce);
        });
    });

    describe("sinon assert pass", function () {
        it("emits pass event through referee.assert", function () {
            var pass = sinon.spy();
            referee.on("pass", pass);

            var spy = sinon.spy();
            spy();
            assert.calledOnce(spy);

            assert(pass.calledOnce);
            assert(pass.calledWith("assert.calledOnce"));
        });
    });

    describe("sinon mock expectation failures", function () {
        it("delegates to referee.assert.fail", function () {
            sandbox.stub(referee, "fail");

            try {
                sinon.mock().never()();
            // eslint-disable-next-line no-empty
            } catch (e) {}

            assert(referee.fail.calledOnce);
        });
    });

    describe("sinon mock expectation pass", function () {
        it("emits pass event through referee.assert", function () {
            var pass = sinon.spy();
            referee.on("pass", pass);

            var expectation = sinon.mock().once();
            expectation();
            expectation.verify();

            assert(pass.calledOnce);
            assert.match(pass.args[0][0], "Expectation met");
        });
    });
});
