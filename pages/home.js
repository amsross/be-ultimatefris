const r = require("ramda");
const html = require("choo/html");
const header = require("../views/header");
const gamesList = require("../views/games-list");
const game = require("../views/game");

module.exports = (state, prev, send) => {
  return html`
    <main onload=${() => send('readGames')}>
      ${header(state, prev, send)}
      <section class="flex">
        ${gamesList(state, prev, send)}
        ${game(state, prev, send)}
      </section>
    </main>
    `;
};
