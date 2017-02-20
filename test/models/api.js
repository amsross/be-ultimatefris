const sinon = require("sinon");
const test = require("tape");
const api = require("../../models/api");

test("models/api", assert => {

  assert.ok(api.state, "property exists");

  test("reducers", assert => {

    assert.ok(api.reducers, "property exists");

    assert.test("receiveGames", assert => {
      const actual = api.reducers.receiveGames({
        "foo": "bar",
        "games": [],
      }, [{
        "bar": "foo"
      }]);
      const expected = {
        "foo": "bar",
        "games": [{
          "bar": "foo"
        }]
      };

      assert.deepEqual(actual, expected, "should update 'games' prop without mutating other props");

      assert.end();
    });

    assert.test("selectGame", assert => {
      const actual = api.reducers.selectGame({
        "games": [{"id": 1}, {"id": 2}],
      }, {"id": 2});
      const expected = {
        "game": {"id": 2},
        "games": [{"id": 1}, {"id": 2}],
      }

      assert.deepEqual(actual, expected, "should set the passed game on the state's 'game' prop");

      assert.end();
    });

    assert.test("unselectGame", assert => {
      const actual = api.reducers.unselectGame({
        "games": [{"id": 1}, {"id": 2}],
      });
      const expected = {
        "game": null,
        "games": [{"id": 1}, {"id": 2}],
      }

      assert.deepEqual(actual, expected, "should set the state's 'game' prop to null");

      assert.end();
    });

    assert.end();
  });

  test("effects", assert => {

    assert.ok(api.effects, "property exists");

    assert.test("createGame", assert => {
      assert.ok(api.effects.createGame, "method exists");

      const send = sinon.spy((storeName, data, done) => done());

      api.effects.createGame({}, {}, send, () => {
        assert.ok(send.calledOnce, "send was called once");
        assert.equal(send.args[0][0], "selectGame", "results sent to correct reducer");

        assert.equal(typeof send.args[0][1], "object", "object passed as new game");
        assert.equal(typeof send.args[0][1].id, "string", "new game has an id");

        assert.end();
      });
    });

    assert.test("readGames", assert => {
      assert.ok(api.effects.readGames, "method exists");

      const send = sinon.spy((storeName, data, done) => done());

      api.effects.readGames({}, {}, send, () => {
        assert.ok(send.calledOnce, "send was called once");
        assert.equal(send.args[0][0], "receiveGames", "results sent to correct reducer");

        assert.ok(send.args[0][1] instanceof Array, "returns array");

        assert.end();
      });
    });

    assert.test("updateGame", assert => {
      assert.ok(api.effects.updateGame, "method exists");

      const send = sinon.spy((storeName, data, done) => done());

      api.effects.updateGame({}, {"id": 1}, send, () => {
        assert.ok(send.calledOnce, "send was called once");
        assert.equal(send.args[0][0], "receiveGames", "results sent to correct reducer");

        assert.ok(send.args[0][1] instanceof Array, "returns array");
        assert.equal(send.args[0][1][0].id, 1, "updated game is returned in state");

        assert.end();
      });
    });

    assert.test("deleteGame", assert => {
      assert.ok(api.effects.deleteGame, "method exists");

      const send = sinon.spy((storeName, data, done) => done());

      api.effects.updateGame({}, {"id": 1}, send, () => {
        assert.ok(send.calledOnce, "send was called once");
        assert.equal(send.args[0][1].length, 1, "a game was returned");

        api.effects.deleteGame({}, {"id": 1}, send, () => {
          assert.ok(send.calledTwice, "send was called a second time");

          assert.equal(send.args[1][0], "receiveGames", "results sent to correct reducer");
          assert.ok(send.args[1][1] instanceof Array, "returns array");
          assert.equal(send.args[1][1].length, 0, "only game was deleted");

          assert.end();
        });
      });
    });

    assert.end();
  });

  assert.end();
});

