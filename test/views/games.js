const r = require("ramda");
const sinon = require("sinon");
const test = require("tape");
const game = require("../../views/game");

test("views/game", assert => {

  const clock = sinon.useFakeTimers(433396800000);
  const state = {
    "game": {
      "id": 1,
      "name": "game 1",
      "date": new Date().toISOString(),
      "location": "Haddonfield, NJ",
    },
    "games": [{
      "id": 1,
      "name": "game 1",
      "date": new Date().toISOString(),
      "location": "Haddonfield, NJ",
    }, {
      "id": 2,
      "name": "game 2",
      "date": new Date().toISOString(),
      "location": "Haddonfield, NJ",
    }]
  };
  const prev = {};
  const send = sinon.spy((effect, data) => {});

  const element = game(state, prev, send);

  assert.equal(element.tagName, "DIV", "returns a container element");

  const form = element.querySelector("article form");

  assert.equal(form.querySelector("input[name='id']").value, "1", "game has correct id");
  assert.equal(form.querySelector("input[name='name']").value, "game 1", "game has correct name");
  assert.equal(form.querySelector("input[name='date']").value, "1983-09-26T00:00", "game has correct date");
  assert.equal(form.querySelector("input[name='location']").value, "Haddonfield, NJ", "game has correct location");

  const inputSubmit = form.querySelector("input[type='submit']");
  inputSubmit.click();
  assert.equal(r.last(send.args)[0], "updateGame", "updateGame effect has been fired");

  form.querySelector("input[name='name']").value = "GAME 1";
  form.querySelector("input[name='date']").value = "2017-01-20T10:37";
  form.querySelector("input[name='location']").value = "HADDONFIELD, NJ";
  inputSubmit.click();
  assert.deepEqual(r.last(send.args)[1], {
    "id": "1",
    "name": "GAME 1",
    "date": "2017-01-20T10:37",
    "location": "HADDONFIELD, NJ",
  }, "correct values passed for updating");

  const linkUnselect = form.querySelector("#game-unselectGame");
  linkUnselect.click();
  assert.equal(r.last(send.args)[0], "unselectGame", "unselectGame effect has been fired");

  clock.restore();
  assert.end();
});
