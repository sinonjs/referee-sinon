/*jslint onevar: false, eqeqeq: false*/
/*global require*/
var sinon = require("sinon");
sinon.sandbox = require("sinon/sandbox");
sinon.assert = require("sinon/assert");

var buster = {
    assert: require("buster-assert"),
    testRunner: require("buster-test/test-runner")
};

buster.testRunner.onCreate = function (runner) {
    runner.on("test:setUp", function (test) {
        var sandbox = sinon.sandbox.create(sinon.getConfig(sinon.config));
        sandbox.inject(test.testCase);

        test.testCase.useFakeTimers = function () {
            return sandbox.useFakeTimers.apply(sandbox, arguments);
        };

        test.testCase.sandbox = sandbox;
    });

    runner.on("test:tearDown", function (test) {
        test.testCase.sandbox.verifyAndRestore();
    });
};

for (var prop in sinon.assert) {
    if (typeof sinon.assert[prop] == "function") {
        buster.assert[prop] = sinon.assert[prop];
    }
}
