require("../lib/sinon-buster");
var buster = require("buster-test");
var assert = require("buster-assert");
var sinon = require("sinon");

var testCase = buster.testCase("sinon-buster", {
    "assertions": {
        "should expose sinon assertions through buster.assert": function () {
            var count = 0;

            for (var prop in sinon.assert) {
                if (typeof sinon.assert[prop] == "function" &&
                    prop != "pass" && prop != "fail") {
                    count++;
                    assert.isFunction(assert[prop], "Expected assert to expose " + prop);
                }
            }

            assert(count > 0);
        },

        "should format assert messages": function () {
            var message;
            var spy = sinon.spy();
            spy({ id: 42 });

            try {
                sinon.assert.calledWith(spy, 3);
            } catch (e) {
                message = e.message;
            }

            assert.match(message, "{ id: 42 }");
        }
    },

    "sinon assert failures": {
        "should delegate to buster.assert.fail": function () {
            sinon.stub(assert, "fail");

            try {
                assert.calledOnce(sinon.spy());
            } catch (e) {}

            var called = assert.fail.calledOnce;
            assert.fail.restore();

            assert(called);
        }
    },

    "sinon assert pass": {
        "should emit pass event through buster.assert": function () {
            var pass = sinon.spy();
            assert.on("pass", pass);

            var spy = sinon.spy();
            spy();
            assert.calledOnce(spy);

            assert(pass.calledOnce);
            assert(pass.calledWith("calledOnce"));
        }
    },

    "test runner integration": {
        setUp: function () {
            this.meth = function () {};
            this.obj = { method: this.meth };
            this.runner = buster.testRunner.create();
        },

        "should bind sandbox to test": function (done) {
            var obj = this.obj, meth = this.meth;

            var tc = buster.testCase("Sandbox test", {
                "test sandboxing": function () {
                    this.stub(obj, "method");
                    assert.notSame(obj.method, meth);
                }
            });

            this.runner.on("suite:end", function (results) {
                assert(results.ok);
                assert.same(obj.method, meth);
                done();
            });

            this.runner.runSuite([tc]);
        },

        "should fail if implicit mock verification fails": function (done) {
            var obj = this.obj, meth = this.meth;

            var tc = buster.testCase("Sandbox test", {
                "test implicit verification": function () {
                    this.mock(obj).expects("method").once();
                }
            });

            this.runner.on("suite:end", function (results) {
                done(function () {
                    assert.isFalse(results.ok);
                    assert.same(obj.method, meth);
                });
            });

            this.runner.runSuite([tc]);
        }
    }
});

// Run
buster.testRunner.assertionCount = function () {
    return 1;
};

var runner = buster.testRunner.create();
var reporter = buster.reporters.xUnitConsole.create({
    color: true, bright: true
}).listen(runner);

runner.runSuite([testCase]);