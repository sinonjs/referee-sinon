"use strict";

var inspect = require("util").inspect;
var sinon = require("sinon");
var referee = require("@sinonjs/referee");

var assert = referee.assert;
var refute = referee.refute;
var expect = referee.expect;

referee = require("./referee-sinon");

function requiresSpy(assertion) {
  // eslint-disable-next-line no-empty-function
  var args = [function () {}, "dummy argument"].concat(
    [].slice.call(arguments, 1)
  );

  assert.exception(function () {
    var argsWithoutFunction = [undefined, undefined];
    assert[assertion].apply(assert, argsWithoutFunction);
  }, /is not a spy/);

  return function () {
    assert.exception(
      function () {
        assert[assertion].apply(assert, args);
      },
      { message: "is not stubbed" }
    );

    assert.exception(
      function () {
        refute[assertion].apply(assert, args);
      },
      { message: "is not stubbed" }
    );
  };
}

describe("referee-sinon", function () {
  afterEach(function () {
    sinon.restore();
  });

  describe("sinon", function () {
    it("exposes sinon", function () {
      assert.same(referee.sinon, sinon);
    });
  });

  describe("mapping", function () {
    var DISALLOWED_METHODS = [
      "createAssertObject",
      "expose",
      "fail",
      // this can be achieved with refute.calledWith
      "neverCalledWith",
      // this can be achieved with refute.calledWithMatch
      "neverCalledWithMatch",
      // this can be achieved with refute.called
      "notCalled",
      "pass",
    ];
    // eslint-disable-next-line mocha/no-setup-in-describe
    var sinonMethods = Object.keys(sinon.assert).filter(function (key) {
      // eslint-disable-next-line mocha/no-setup-in-describe
      var isDisallowed = DISALLOWED_METHODS.indexOf(key) !== -1;
      // eslint-disable-next-line mocha/no-setup-in-describe
      var isFunction = typeof sinon.assert[key] === "function";

      return !isDisallowed && isFunction;
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    sinonMethods.forEach(function (methodName) {
      it(`should map '${methodName}' from sinon.assert`, function () {
        assert.isFunction(referee.assert[methodName]);
        assert.isFunction(referee.refute[methodName]);
      });
    });

    // eslint-disable-next-line mocha/no-setup-in-describe
    DISALLOWED_METHODS.forEach(function (methodName) {
      it(`must not map disallowed '${methodName}' from sinon.assert`, function () {
        assert.isUndefined(referee.assert[methodName]);
        assert.isUndefined(referee.refute[methodName]);
      });
    });
  });

  describe("assertions", function () {
    describe("calledWith", function () {
      it("fails when not called with spy", requiresSpy("calledWith"));

      it("passes when spy is explicitly passed null", function () {
        var spy = sinon.spy();
        spy(null, "Hey!");

        assert.calledWith(spy, null, "Hey!");
      });

      it("formats message nicely", function () {
        var spy = sinon.spy();
        spy(null, 1, 2);

        try {
          assert.calledWith(spy, null, 2, 2);
          throw new Error("Exception expected");
        } catch (e) {
          var message =
            `[assert.calledWith] Expected ${inspect(
              spy
            )} to be called with arguments null, 2, 2` +
            `\n    spy(null, 1, 2)`;
          assert.match(e.message, message);
        }
      });

      it("works with spy calls", function () {
        var spy = sinon.spy();
        spy(null, "Hey!");

        assert.calledWith(spy.firstCall, null, "Hey!");
      });

      it("works with fakes", function () {
        var fake = sinon.fake();
        fake(null, 1, 2);

        try {
          assert.calledWith(fake, null, 2, 2);
          throw new Error("Exception expected");
        } catch (e) {
          var message =
            `[assert.calledWith] Expected ${inspect(
              fake
            )} to be called with arguments null, 2, 2` +
            `\n    fake(null, 1, 2)`;
          assert.match(e.message, message);
        }
      });

      it("formats error argument", function () {
        var fake = sinon.fake();
        fake(new Error());

        try {
          assert.calledWith(fake, null);
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.calledWith] Expected ${inspect(
            fake
          )} to be called with arguments null\n    fake(Error)`;
          assert.match(e.message, message);
        }
      });
    });

    describe("calledWithExactly", function () {
      it("fails when not called with spy", requiresSpy("calledWithExactly"));

      it("passes when spy is explicitly passed null", function () {
        var spy = sinon.spy();
        spy(null, "Hey!");

        assert.calledWithExactly(spy, null, "Hey!");
      });

      it("formats message nicely", function () {
        var spy = sinon.spy();
        spy(null, 1, 2);

        try {
          assert.calledWithExactly(spy, null, 2, 2);
          throw new Error("Exception expected");
        } catch (e) {
          var message =
            `[assert.calledWithExactly] Expected ${inspect(
              spy
            )} to be called with exact ` +
            `arguments null, 2, 2\n    spy(null, 1, 2)`;
          assert.match(e.message, message);
        }
      });

      it("works with spy calls", function () {
        var spy = sinon.spy();
        spy(null, "Hey!");

        assert.calledWithExactly(spy.firstCall, null, "Hey!");
      });
    });

    describe("calledWithMatch", function () {
      it("fails when not called with spy", requiresSpy("calledWithMatch"));

      it("passes when spy is passed matching object", function () {
        var spy = sinon.spy();
        spy({
          check: 123,
          color: "#fff",
        });

        assert.calledWithMatch(spy, { check: 123 });
      });

      it("formats message nicely", function () {
        var spy = sinon.spy();
        spy({ check: 123 });

        try {
          assert.calledWithMatch(spy, { check: 321 });
          throw new Error("Exception expected");
        } catch (e) {
          var message =
            `[assert.calledWithMatch] Expected ${inspect(
              spy
            )} to be called with matching ` +
            `arguments { check: 321 }\n    spy({ check: 123 })`;
          assert.match(e.message, message);
        }
      });

      it("works with spy calls", function () {
        var spy = sinon.spy();
        spy({
          check: 123,
          color: "#fff",
        });

        assert.calledWithMatch(spy.firstCall, { check: 123 });
      });
    });

    describe("calledOnceWithMatch", function () {
      it("fails when not called with spy", requiresSpy("calledOnceWithMatch"));

      it("passes when spy is passed matching object", function () {
        var spy = sinon.spy();
        spy({
          check: 123,
          color: "#fff",
        });

        assert.calledOnceWithMatch(spy, { check: 123 });
      });

      it("fails when spy is passes non-matching object", function () {
        var spy = sinon.spy();
        spy({
          check: 123,
          color: "#fff",
        });

        refute.calledOnceWithMatch(spy, { check: 321 });
      });

      it("fails when spy was called more than once", function () {
        var spy = sinon.spy();
        spy({
          check: 123,
          color: "#fff",
        });
        spy({
          check: 321,
          color: "#eee",
        });

        refute.calledOnceWithMatch(spy, { check: 123 });
      });

      context("when called more than once with same arguments", function () {
        it("fails", function () {
          var spy = sinon.spy();
          spy("hello", "Hey");
          spy("hello", "Hey");

          refute.calledOnceWithMatch(spy, "hello", "Hey");
        });
      });

      it("formats message nicely", function () {
        var spy = sinon.spy();
        spy(null, 1, 2);

        try {
          assert.calledOnceWithMatch(spy, null, 2, 2);
          throw new Error("Exception expected");
        } catch (e) {
          var message =
            `[assert.calledOnceWithMatch] Expected ${inspect(
              spy
            )} to be called once with matching arguments ` +
            `null, 2, 2\n    spy(null, 1, 2)`;
          assert.match(e.message, message);
        }
      });
    });

    describe("alwaysCalledWithMatch", function () {
      it(
        "fails when not called with spy",
        requiresSpy("alwaysCalledWithMatch")
      );

      it("passes when spy is always passed matching object", function () {
        var spy = sinon.spy();
        spy({
          check: 123,
          color: "#aaa",
        });
        spy({
          check: 123,
          color: "#bbb",
        });

        assert.alwaysCalledWithMatch(spy, { check: 123 });
      });

      it("formats message nicely", function () {
        var spy = sinon.spy();
        spy({ check: 123 });
        spy({ check: 321 });

        try {
          assert.alwaysCalledWithMatch(spy, { check: 321 });
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.alwaysCalledWithMatch] Expected ${inspect(
            spy
          )} to always be called with matching arguments { check: 321 }`;
          var lines = e.message.split("\n");
          assert.equals(lines.length, 3);
          assert.equals(lines[0], message);
          assert.match(lines[1], "    spy({ check: 123 })");
          assert.match(lines[2], "    spy({ check: 321 })");
        }
      });
    });

    describe("calledOnce", function () {
      it("fails when not called with spy", requiresSpy("calledOnce"));

      it("passes when called once", function () {
        var spy = sinon.spy();
        spy(null, "Hey");

        assert.calledOnce(spy);
      });

      it("formats message nicely", function () {
        var spy = sinon.spy();

        try {
          assert.calledOnce(spy);
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.calledOnce] Expected ${inspect(
            spy
          )} to be called once but was called 0 times`;
          assert.equals(e.message, message);
        }
      });
    });

    describe("calledTwice", function () {
      it("fails when not called with spy", requiresSpy("calledTwice"));

      it("passes when called twice", function () {
        var spy = sinon.spy();
        spy(null, "Hey");
        spy(null, "Ho");

        assert.calledTwice(spy);
      });

      it("formats message nicely", function () {
        var spy = sinon.spy();
        spy(null, "Hey");

        try {
          assert.calledTwice(spy);
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.calledTwice] Expected ${inspect(
            spy
          )} to be called twice but was called once`;
          assert.match(e.message, message);
          assert.match(e.message, "spy(null, 'Hey')");
        }
      });
    });

    describe("calledThrice", function () {
      it("fails when not called with spy", requiresSpy("calledThrice"));

      it("passes when called thrice", function () {
        var spy = sinon.spy();
        spy(null, "Hey");
        spy(null, "Ho");
        spy(null, "There");

        assert.calledThrice(spy);
      });

      it("formats message nicely", function () {
        var spy = sinon.spy();
        spy(null, "Hey");
        spy(null, "Ho");

        try {
          assert.calledThrice(spy);
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.calledThrice] Expected ${inspect(
            spy
          )} to be called thrice but was called twice`;
          assert.match(e.message, message);
          assert.match(e.message, "spy(null, 'Hey')");
          assert.match(e.message, "spy(null, 'Ho')");
        }
      });
    });

    describe("callCount", function () {
      it("fails when not called with spy", requiresSpy("callCount"));

      it("passes as callCount changes", function () {
        var spy = sinon.spy();

        for (var i = 1; i <= 100; i++) {
          spy(null, "Hey");
          assert.callCount(spy, i);
        }
      });

      it("formats message nicely", function () {
        var spy = sinon.spy();

        try {
          assert.callCount(spy, 1);
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.callCount] Expected ${inspect(
            spy
          )} to be called exactly 1 times, but was called 0 times`;
          assert.match(e.message, message);
        }
      });
    });

    describe("called", function () {
      it("fails when not called with spy", requiresSpy("called"));

      it("passes when called once", function () {
        var spy = sinon.spy();
        spy(null, "Hey");

        assert.called(spy);
      });

      it("formats message", function () {
        var spy = sinon.spy();

        try {
          assert.called(spy);
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.called] Expected ${inspect(
            spy
          )} to be called at least once but was never called`;
          assert.equals(e.message, message);
        }
      });
    });

    describe("calledWithNew", function () {
      it("fails when not called with spy", requiresSpy("calledWithNew"));

      it("passes when called with new", function () {
        var spy = sinon.spy();

        // eslint-disable-next-line no-new, new-cap
        new spy();

        assert.calledWithNew(spy);
      });

      it("formats message", function () {
        var spy = sinon.spy();
        spy();

        try {
          assert.calledWithNew(spy);
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.calledWithNew] Expected ${inspect(
            spy
          )} to be called with 'new' at least once but was never called with 'new'`;
          assert.equals(e.message, message);
        }
      });

      it("works with spy calls", function () {
        var spy = sinon.spy();

        // eslint-disable-next-line no-new, new-cap
        new spy();

        assert.calledWithNew(spy.firstCall);
      });
    });

    describe("alwaysCalledWithNew", function () {
      it("fails when not called with spy", requiresSpy("alwaysCalledWithNew"));

      it("passes when always called with new", function () {
        var spy = sinon.spy();

        // eslint-disable-next-line no-new, new-cap
        new spy();
        // eslint-disable-next-line no-new, new-cap
        new spy();
        // eslint-disable-next-line no-new, new-cap
        new spy();

        assert.alwaysCalledWithNew(spy);
      });

      it("formats message", function () {
        var spy = sinon.spy();
        spy();
        spy();

        try {
          assert.alwaysCalledWithNew(spy);
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.alwaysCalledWithNew] Expected ${inspect(
            spy
          )} to always be called with 'new'`;
          assert.equals(e.message, message);
        }
      });
    });

    describe("callOrder", function () {
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
          throw new Error("Exception expected");
        } catch (e) {
          var message =
            "[assert.callOrder] Expected 0, 1 to be " +
            "called in order but were called as 1, 0";
          assert.equals(e.message, message);
        }
      });
    });

    describe("calledOn", function () {
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
          throw new Error("Exception expected");
        } catch (e) {
          var message =
            `[assert.calledOn] Expected ${inspect(
              spy
            )} to be called with { id: 12 } as this but was ` +
            `called on { id: 42 }`;
          assert.equals(e.message, message);
        }
      });

      it("works with spy calls", function () {
        var spy = sinon.spy();
        var object = { id: 42 };
        spy.call(object);

        assert.calledOn(spy.firstCall, object);
      });
    });

    describe("alwaysCalledOn", function () {
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
          throw new Error("Exception expected");
        } catch (e) {
          var message =
            `[assert.alwaysCalledOn] Expected ${inspect(
              spy
            )} to always be called with { id: 12 } as ` +
            `this but was called on { id: 42 }`;
          assert.equals(e.message, message);
        }
      });
    });

    describe("alwaysCalledWith", function () {
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
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.alwaysCalledWith] Expected ${inspect(
            spy
          )} to always be called with arguments 12\n    spy(42)`;
          assert.match(e.message, message);
        }
      });
    });

    describe("alwaysCalledWithExactly", function () {
      it(
        "fails when not called with spy",
        requiresSpy("alwaysCalledWithExactly")
      );

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
          throw new Error("Exception expected");
        } catch (e) {
          var message =
            `[assert.alwaysCalledWithExactly] Expected ${inspect(
              spy
            )} to always be called with ` +
            `exact arguments null, 2, 2\n    spy(null, 1, 2)`;
          assert.match(e.message, message);
        }
      });
    });

    describe("calledOnceWithExactly", function () {
      it(
        "fails when not called with spy",
        requiresSpy("calledOnceWithExactly")
      );

      it("fails when spy is explicitly passed null", function () {
        var spy = sinon.spy();
        spy(null, "Hey");

        refute.calledOnceWithExactly(spy, null, "Hey!");
      });

      context("when called more than once with same arguments", function () {
        it("fails", function () {
          var spy = sinon.spy();
          spy("hello", "Hey");
          spy("hello", "Hey");

          refute.calledOnceWithExactly(spy, "hello", "Hey");
        });
      });

      it("formats message nicely", function () {
        var spy = sinon.spy();
        spy(null, 1, 2);

        try {
          assert.calledOnceWithExactly(spy, null, 2, 2);
          throw new Error("Exception expected");
        } catch (e) {
          var message =
            `[assert.calledOnceWithExactly] Expected ${inspect(
              spy
            )} to be called once with exact arguments ` +
            `null, 2, 2\n    spy(null, 1, 2)`;
          assert.match(e.message, message);
        }
      });
    });

    describe("threw", function () {
      it("fails when not called with spy", requiresSpy("threw"));

      it("passes when spy threw", function () {
        var spy = sinon.stub().throws();
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
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.threw] Expected ${inspect(
            spy
          )} to throw an exception`;
          assert.equals(e.message, message);
        }
      });

      it("works with spy calls", function () {
        var spy = sinon.stub().throws();
        try {
          spy();
          // eslint-disable-next-line no-empty
        } catch (e) {}
        assert.threw(spy.firstCall);
      });
    });

    describe("alwaysThrew", function () {
      it("fails when not called with spy", requiresSpy("alwaysThrew"));

      it("passes when spy always threw", function () {
        var spy = sinon.stub().throws();
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
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.alwaysThrew] Expected ${inspect(
            spy
          )} to always throw an exception`;
          assert.equals(e.message, message);
        }
      });
    });

    describe("calledOnceWith", function () {
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
          throw new Error("Exception expected");
        } catch (e) {
          var message = `[assert.calledOnceWith] Expected ${inspect(
            spy
          )} to be called once with arguments 12\n    spy(42)`;
          assert.match(e.message, message);
        }
      });
    });
  });

  describe("expectations", function () {
    it("toHaveBeenCalledWithMatch", function () {
      var stub = sinon.stub(assert, "calledWithMatch");

      expect().toHaveBeenCalledWithMatch();

      assert.calledOnce(stub);
    });

    it("toHaveAlwaysBeenCalledWithMatch", function () {
      var stub = sinon.stub(assert, "alwaysCalledWithMatch");

      expect().toHaveAlwaysBeenCalledWithMatch();

      assert.calledOnce(stub);
    });
  });

  describe("sinon assert failures", function () {
    it("delegates to referee.assert.fail", function () {
      sinon.stub(referee, "fail");

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
      sinon.stub(referee, "fail");

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

  describe("match from referee with sinon assert", function () {
    it("matches", function () {
      var fake = sinon.fake();

      fake(42);

      referee.assert.calledWith(fake, referee.match.number);
    });
  });
});
