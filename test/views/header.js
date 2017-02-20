const sinon = require("sinon");
const test = require("tape");
const header = require("../../views/header");

test("views/header", assert => {

  const state = {};
  const prev = {};
  const send = sinon.spy(effect => {});

  const element = header(state, prev, send);

  assert.equal(element.tagName, "NAV", "returns a nav");

  const linkCreate = element.querySelector("a[title='Create']");
  assert.ok(linkCreate, "link to create new games exists");
  assert.notOk(send.called, "createGame effect has not been fired yet");
  linkCreate.click();
  assert.ok(send.calledOnce, "createGame effect has been fired");

  assert.end();
});
