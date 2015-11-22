((typeof define === "function" && define.amd && function (m) {
    define("referee-sinon", m);
}) || (typeof module === "object" &&
       typeof require === "function" && function (m) {
        module.exports = m();
    }) || function (m) { this.refereeSinon = m(); }
)(function () {
    return function (referee, sinon) {
        sinon.expectation.pass = function (assertion) {
            referee.emit("pass", assertion);
        };

        sinon.expectation.fail = function (message) {
            referee.fail(message);
        };

        // Lazy bind the format method to referee's. This way, Sinon will
        // always format objects like referee does, even if referee is
        // configured after referee-sinon is loaded
        sinon.format = function () {
            return referee.format.apply(referee, arguments);
        };

        function verifyFakes() {
            var method, isNot, i, l;

            for (i = 0, l = arguments.length; i < l; ++i) {
                method = arguments[i];
                isNot = (method || "fake") + " is not ";

                if (!method) { this.fail(isNot + "a spy"); }
                if (typeof method !== "function") {
                    this.fail(isNot + "a function");
                }
                if (typeof method.getCall !== "function") {
                    this.fail(isNot + "stubbed");
                }
            }

            return true;
        }

        var sf = sinon.spy.formatters;

        referee.add("called", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.called;
            },
            assertMessage: "Expected ${spyObj} to be called at least once but was never called",
            refuteMessage: "Expected ${spyObj} to not be called but was called ${times}${calls}",
            expectation: "toHaveBeenCalled",
            values: function (spyObj) {
                return {
                    spyObj: spyObj,
                    times: sf.c(spyObj),
                    calls: sf.C(spyObj)
                };
            }
        });

        function slice(arr, from, to) {

            // don't pass "to" if not defined, because IE8 doesn't like that
            if (to) {
                return [].slice.call(arr, from, to);
            }

            return [].slice.call(arr, from);
        }

        referee.add("callOrder", {
            assert: function (spy) {
                var type = Object.prototype.toString.call(spy);
                var isArray = type === "[object Array]";
                var args = isArray ? spy : arguments;
                verifyFakes.apply(this, args);
                if (sinon.calledInOrder(args)) { return true; }

                this.expected = [].join.call(args, ", ");
                this.actual = sinon.orderByFirstCall(slice(args)).join(", ");
            },

            assertMessage: "Expected ${expected} to be called in order but were called as ${actual}",
            refuteMessage: "Expected ${expected} not to be called in order"
        });

        function addCallCountAssertion(count) {
            referee.add("called" + count, {
                assert: function (spy) {
                    verifyFakes.call(this, spy);
                    return spy["called" + count];
                },
                assertMessage: "Expected ${spyObj} to be called ${expectedTimes} but was called ${times}${calls}",
                refuteMessage: "Expected ${spyObj} to not be called exactly ${expectedTimes}${calls}",
                expectation: "toHaveBeenCalled" + count,
                values: function (spyObj) {
                    return {
                        spyObj: spyObj,
                        expectedTimes: count.toLowerCase(),
                        times: sf.c(spyObj),
                        calls: sf.C(spyObj)
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
                actualThis: (spyObj.printf ? spyObj.printf("%t") : "")
            };
        }

        referee.add("calledOn", {
            assert: function (spy, thisObj) {
                verifyFakes.call(this, spy);
                return spy.calledOn(thisObj);
            },
            assertMessage: "Expected ${spyObj} to be called with ${expectedThis} as this but was called on ${actualThis}",
            refuteMessage: "Expected ${spyObj} not to be called with ${expectedThis} as this",
            expectation: "toHaveBeenCalledOn",
            values: valuesWithThis
        });

        referee.add("alwaysCalledOn", {
            assert: function (spy, thisObj) {
                verifyFakes.call(this, spy);
                return spy.alwaysCalledOn(thisObj);
            },
            assertMessage: "Expected ${spyObj} to always be called with ${expectedThis} as this but was called on ${actualThis}",
            refuteMessage: "Expected ${spyObj} not to always be called with ${expectedThis} as this",
            expectation: "toHaveAlwaysBeenCalledOn",
            values: valuesWithThis
        });

        function formattedArgs(args, i) {
            var l, result;
            for (l = args.length, result = []; i < l; ++i) {
                result.push(sinon.format(args[i]));
            }
            return result.join(", ");
        }

        function spyAndCalls(spyObj) {
            var expected = formattedArgs(arguments, 1);
            var actual = spyObj.printf ? spyObj.printf("%C") : "";
            return {
                spyObj: spyObj,
                actual: actual,
                expected: expected
            }
        }

        referee.add("calledWith", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.calledWith.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${spyObj} to be called with arguments ${expected}${actual}",
            refuteMessage: "Expected ${spyObj} not to be called with arguments ${expected}${actual}",
            expectation: "toHaveBeenCalledWith",
            values: spyAndCalls
        });

        referee.add("alwaysCalledWith", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.alwaysCalledWith.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${spyObj} to always be called with arguments ${expected}${actual}",
            refuteMessage: "Expected ${spyObj} not to always be called with arguments ${expected}${actual}",
            expectation: "toHaveAlwaysBeenCalledWith",
            values: spyAndCalls
        });

        referee.add("calledOnceWith", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.calledOnce &&
                    spy.calledWith.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${spyObj} to be called once with arguments ${expected}${actual}",
            refuteMessage: "Expected ${spyObj} not to be called once with arguments ${expected}${actual}",
            expectation: "toHaveBeenCalledOnceWith",
            values: spyAndCalls
        });

        referee.add("calledWithExactly", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.calledWithExactly.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${spyObj} to be called with exact arguments ${expected}${actual}",
            refuteMessage: "Expected ${spyObj} not to be called with exact arguments ${expected}${actual}",
            expectation: "toHaveBeenCalledWithExactly",
            values: spyAndCalls
        });

        referee.add("alwaysCalledWithExactly", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.alwaysCalledWithExactly.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${spyObj} to always be called with exact arguments ${expected}${actual}",
            refuteMessage: "Expected ${spyObj} not to always be called with exact arguments ${expected}${actual}",
            expectation: "toHaveAlwaysBeenCalledWithExactly",
            values: spyAndCalls
        });

        referee.add("calledWithMatch", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.calledWithMatch.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${spyObj} to be called with matching arguments ${expected}${actual}",
            refuteMessage: "Expected ${spyObj} not to be called with matching arguments ${expected}${actual}",
            expectation: "toHaveBeenCalledWithMatch",
            values: spyAndCalls
        });

        referee.add("alwaysCalledWithMatch", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.alwaysCalledWithMatch.apply(spy, slice(arguments, 1));
            },
            assertMessage: "Expected ${spyObj} to always be called with matching arguments ${expected}${actual}",
            refuteMessage: "Expected ${spyObj} not to always be called with matching arguments ${expected}${actual}",
            expectation: "toHaveAlwaysBeenCalledWithMatch",
            values: spyAndCalls
        });

        function spyAndException(spyObj, exception) {
            return {
                spyObj: spyObj,
                actual: spyObj.printf ? spyObj.printf("%C") : "",
                exception: exception // note: not actually used
            };
        }

        referee.add("threw", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.threw(arguments[1]);
            },
            assertMessage: "Expected ${spyObj} to throw an exception${actual}",
            refuteMessage: "Expected ${spyObj} not to throw an exception${actual}",
            expectation: "toHaveThrown",
            values: spyAndException
        });

        referee.add("alwaysThrew", {
            assert: function (spy) {
                verifyFakes.call(this, spy);
                return spy.alwaysThrew(arguments[1]);
            },
            assertMessage: "Expected ${spyObj} to always throw an exception${actual}",
            refuteMessage: "Expected ${spyObj} not to always throw an exception${actual}",
            expectation: "toAlwaysHaveThrown",
            values: spyAndException
        });
    };
});
