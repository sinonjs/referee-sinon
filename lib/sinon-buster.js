/*jslint onevar: false, eqeqeq: false*/
/*global require*/
var sinon = require("sinon");
sinon.assert = require("sinon/assert");

var buster = {
    assert: require("buster-assert"),
    testRunner: require("buster-test/test-runner")
};

try {
    var util = require("buster-test/util");
    util.stackFilters.push("lib/sinon");
} catch (e) {}

buster.testRunner.onCreate = function (runner) {
    runner.on("test:setUp", function (test) {
        var config = sinon.getConfig(sinon.config);
        config.useFakeServer = false;
        var sandbox = sinon.sandbox.create();
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
    if (typeof sinon.assert[prop] == "function" && prop != "fail" && prop != "pass") {
        buster.assert[prop] = sinon.assert[prop];
    }
}

sinon.assert.fail = buster.assert.fail;
sinon.assert.pass = buster.assert.pass;