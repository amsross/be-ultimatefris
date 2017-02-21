const r = require("ramda");
const sinon = require("sinon");
const test = require("tape");
const home = require("../../pages/home");

test("pages/home", assert => {

  const state = {
    "game": {
      "id": "1",
      "name": "game 1",
      "date": new Date().toISOString(),
      "location": "Haddonfield, NJ",
    },
    "games": [{
      "id": "1",
      "name": "game 1",
      "date": new Date().toISOString(),
      "location": "Haddonfield, NJ",
    }, {
      "id": "2",
      "name": "game 2",
      "date": new Date().toISOString(),
      "location": "Haddonfield, NJ",
    }]
  };
  const prev = {};
  const send = sinon.spy((effect, ...rest) => {});

  assert.test("game selected", assert => {

    const element = home(state, prev, send);
    document.body.appendChild(element);

    assert.equal(element.tagName, "MAIN", "returns a container element");
    // assert.ok(send.called, "send triggered");
    // assert.equal(r.last(send.args)[0], "readGames", "readGames effect has been fired");

    assert.equal(element.querySelector("nav").tagName, "NAV", "contains the header view");
    // element.querySelector("nav a").click();
    // assert.ok(send.called, "send triggered");
    // assert.equal(r.last(send.args)[0], "createGame", "createGame effect has been fired");

    assert.equal(element.querySelector("section section:nth-child(2)").children.length, 2, "both games-list and game views are present");
    // element.querySelector("section a").click();
    // assert.ok(send.called, "send triggered");
    // assert.equal(r.last(send.args)[0], "selectGame", "selectGame effect has been fired");

    assert.end();
  });

  assert.test("no game selected", assert => {

    const element = home(r.assoc("game", null, state), prev, send);
    document.body.appendChild(element);

    assert.equal(element.tagName, "MAIN", "returns a container element");
    // assert.ok(send.called, "send triggered");
    // assert.equal(r.last(send.args)[0], "readGames", "readGames effect has been fired");

    assert.equal(element.querySelector("nav").tagName, "NAV", "contains the header view");
    // element.querySelector("nav a").click();
    // assert.ok(send.called, "send triggered");
    // assert.equal(r.last(send.args)[0], "createGame", "createGame effect has been fired");

    assert.equal(element.querySelector("section section:nth-child(2)").children.length, 1, "only games-list view are present");
    // element.querySelector("section a").click();
    // assert.ok(send.called, "send triggered");
    // assert.equal(r.last(send.args)[0], "selectGame", "selectGame effect has been fired");

    assert.end();
  });

  assert.end();
});
