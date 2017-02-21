const r = require("ramda");
const html = require("choo/html");
const moment = require("moment-timezone");
const serialize = require("form-serialize");

module.exports = function view(state, prev, send) {

  const game = state.game;

  if (game === null || game === undefined) return;

  function onSubmit (e) {
    send("updateGame", serialize(e.target, { hash: true }));
    e.preventDefault();
  }

  return html`
      <div class="flex-auto">
        <article class="w-100 border-box pa3 ph5 bg-light-gray">
          <form class="pa4 black-80" onsubmit=${onSubmit}>

            <input id="id" name="id" type="hidden" value="${game.id}" >
            <label for="name" class="f6 b db mb2">Name</label>
            <input id="name" name="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" value="${game.name||"New Game"}">

            <label for="date" class="f6 b db mb2">Date</label>
            <input id="date" name="date" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" value="${moment(game.date).format("YYYY-MM-DDTHH:mm")}">

            <label for="location" class="f6 b db mb2">Location</label>
            <input id="location" name="location" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" value="${game.location||"Haddonfield, NJ"}">
            <p>MAP</p>

            <div class="mt5">
              <input class="b dim ph3 pv2 input-reset ba b--green bg-transparent pointer f6" type="submit" value="Save">
              <a class="b dim ph3 pv2 input-reset ba b--black bg-transparent pointer f6" onclick=${send.bind(null, "unselectGame")}>x</a>
            </div>

          </form>
        </article>
      </div>
    `;
};
