const test = require("tape");
const map = require("../../views/map");

test("views/map", assert => {

  const state = {};
  const prev = {};
  const send = () => {};

  const element = map(state, prev, send);

  assert.equal(element.tagName, "DIV", "returns a container element");

  assert.end();
});

