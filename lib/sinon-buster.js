/*jslint onevar: false, eqeqeq: false*/
/*global require*/
if (typeof require != "undefined") {
    var sinon = require("sinon");

    var buster = {
        assert: require("buster-assert"),
        testRunner: require("buster-test").testRunner
    };

    try {
        buster.test = require("buster-test/util");
    } catch (e) {}
}

if (buster.test && buster.test.stackFilters) {
    buster.test.stackFilters.push("lib/sinon");
}

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