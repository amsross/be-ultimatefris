const r = require("ramda");
const sinon = require("sinon");
const test = require("tape");
const gamesList = require("../../views/games-list");

test("views/gamesList", assert => {

  const state = {
    "games": [{
      "id": 1,
      "name": "game 1",
      "date": new Date(),
      "location": "Haddonfield, NJ",
    }, {
      "id": 2,
      "name": "game 2",
      "date": new Date(),
      "location": "Haddonfield, NJ",
    }]
  };
  const prev = {};
  const send = sinon.spy(effect => {});

  const element = gamesList(state, prev, send);

  assert.equal(element.tagName, "DIV", "returns a container element");

  const games = element.querySelectorAll("article");
  assert.equal(games.length, 2, "one entry for each game in the state");

  r.addIndex(r.map)((game, idx) => {
    const gameFromState = state.games[idx];
    assert.equal(game.querySelector("h1").innerHTML, gameFromState.name, "game has correct name");
    assert.equal(game.querySelector("h2").innerHTML, gameFromState.location, "game has correct location");

    const linkView = game.querySelector("a");
    linkView.click();
    assert.equal(r.last(send.args)[0], "selectGame", "selectGame effect has been fired");
    assert.equal(r.last(send.args)[1].id, gameFromState.id, "selectGame effect was fired for the current game");
  }, games);

  assert.end();
});

