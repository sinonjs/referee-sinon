/*jslint onevar: false, eqeqeq: false*/
/*global require*/
if (typeof require != "undefined") {
    var sinon = require("sinon");

    var buster = {
        assert: require("buster-assert"),
        format: require("buster-format"),
        testRunner: require("buster-test").testRunner,
        stackFilter: require("buster-test").stackFilter
    };
}

if (buster.stackFilter && buster.stackFilter.filters) {
    buster.stackFilter.filters.push("lib/sinon");
}

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

for (var prop in sinon.assert) {
    if (typeof sinon.assert[prop] == "function" && prop != "fail" && prop != "pass") {
        buster.assert[prop] = sinon.assert[prop];
    }
}

sinon.format = buster.format.ascii;
sinon.assert.fail = buster.assert.fail;

sinon.assert.pass = function (assertion) {
    buster.assert.emit("pass", assertion);
};
