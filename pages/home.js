const html = require('choo/html')
const header = require('../views/header')
const map = require('../views/map')
const gamesList = require('../views/games-list')
const game = require('../views/game')

module.exports = (state, emit) => {
  return html`
    <body>
      <main onload=${() => emit('readGames')}>
        ${header(state, emit)}
        <section class="flex flex-row">
          <section class="flex-auto order-0" style="flex-basis:50%;">
            ${map(state, emit)}
          </section>
          <section class="flex-auto order-1 flex-column">
            ${game(state, emit)}
            ${gamesList(state, emit)}
          </section>
        </section>
      </main>
    </body>
    `
}
