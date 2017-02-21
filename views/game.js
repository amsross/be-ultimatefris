const $ = require("jquery");
const r = require("ramda");
const h = require("highland");
const html = require("choo/html");
const moment = require("moment-timezone");
const geocoder = require("geocoder-geojson")
const serialize = require("form-serialize");

module.exports = function view(state, prev, send) {

  if (state.game === null || state.game === undefined) return;

  const game = r.over(r.lensProp("coords"), r.compose(r.unnest, r.of), state.game);

  function onSubmit (e) {
    send("updateGame", serialize(e.target, { hash: true }));
    e.preventDefault();
  }

  function onload(elem) {
    const form = elem.querySelector("form");
    const inputLocation = $(form.querySelector("#location"));
    const inputLocationKeyup = h("keyup", inputLocation)
    const inputLocationChange = h("change", inputLocation)

    h([inputLocationKeyup, inputLocationChange])
      .merge()
      .debounce(750)
      .map(evt => evt.currentTarget.value)
      .flatMap(address => h(geocoder.google(address, {short: true})))
      .map(r.compose(
        r.reverse,
        r.unnest, r.of,
        r.path(["geometry", "coordinates"]),
        r.head,
        r.prop("features")))
      .each(coords => {
        send("selectGame", r.assoc("coords", coords, serialize(form, { hash: true })));
      });
  }

  function onDelete(e) {
    send("deleteGame", game);
    e.preventDefault();
  }

  function onUnselect(e) {
    send("unselectGame");
    e.preventDefault();
  }

  return html`
      <article class="game w-100 bg-light-gray" onload=${onload}>
        <form class="pa4 black-80" onsubmit=${onSubmit}>

          <input id="id" name="id" type="hidden" value="${game.id}" >
          <label for="name" class="f6 b db mb2">Name</label>
          <input id="name" name="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" value="${game.name||"New Game"}">

          <label for="date" class="f6 b db mb2">Date</label>
          <input id="date" name="date" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" value="${moment(game.date).format("YYYY-MM-DDTHH:mm")}">

          <label for="location" class="f6 b db mb2">Location</label>
          <input id="location" name="location" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" value="${game.location||"Haddonfield, NJ"}">
          <input id="coords[0]" name="coords[0]" type="hidden" value="${r.init(game.coords)}">
          <input id="coords[1]" name="coords[1]" type="hidden" value="${r.last(game.coords)}">

          <div class="mt5">
            <input type="submit" id="game-save"         value="Save"   class="w-30 dib b dim ph3 pv2 input-reset ba bg-transparent pointer f6 b--green" >
            <input type="submit" id="game-unselectGame" value="Close"  class="w-30 dib b dim ph3 pv2 input-reset ba bg-transparent pointer f6 b--black" onclick=${onUnselect} >
            <input type="submit" id="game-deleteGame"   value="Delete" class="w-30 dib b dim ph3 pv2 input-reset ba bg-transparent pointer f6 b--red"   onclick=${onDelete} >
          </div>

        </form>
      </article>
    `;
};
