const r = require("ramda");
const html = require("choo/html");
const header = require("../views/header");
const map = require("../views/map");
const gamesList = require("../views/games-list");
const game = require("../views/game");

module.exports = (state, prev, send) => {
  return html`
    <main onload=${() => send('readGames')}>
      ${header(state, prev, send)}
      <section class="flex flex-row">
        <section class="flex-auto order-0" style="flex-basis:50%;">
          ${map(state, prev, send)}
        </section>
        <section class="flex-auto order-1 flex-column">
          ${game(state, prev, send)}
          ${gamesList(state, prev, send)}
        </section>
      </section>
    </main>
    `;
};
