const r = require('ramda')
const html = require('choo/html')
const moment = require('moment-timezone')
const serialize = require('form-serialize')

module.exports = function view (state, emit) {
  if (state.game === null || state.game === undefined) return

  const game = r.over(r.lensProp('coords'), r.compose(r.unnest, r.of), state.game)

  function onSubmit (e) {
    emit('updateGame', serialize(e.target, { hash: true }))
    e.preventDefault()
  }

  function onDelete(e) {
    emit('deleteGame', r.pick(['id'], game))
    e.preventDefault()
  }

  function onUnselect (e) {
    emit('unselectGame')
    e.preventDefault()
  }

  return html`
      <article class="game w-100 bg-light-gray">
        <form class="pa4 black-80" onsubmit=${onSubmit}>

          <input id="id" name="id" type="hidden" value="${game.id}" >
          <label for="name" class="f6 b db mb2">Name</label>
          <input id="name" name="name" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" value="${game.name || 'New Game'}">

          <label for="date" class="f6 b db mb2">Date</label>
          <input id="date" name="date" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" value="${moment(game.date).format('YYYY-MM-DDTHH:mm')}">

          <label for="location" class="f6 b db mb2">Location</label>
          <input id="location" name="location" class="input-reset ba b--black-20 pa2 mb2 db w-100" type="text" value="${game.location || 'Haddonfield, NJ'}">
          <input id="coords[0]" name="coords[0]" type="hidden" value="${r.init(game.coords)}">
          <input id="coords[1]" name="coords[1]" type="hidden" value="${r.last(game.coords)}">

          <div class="mt5">
            <input type="submit" id="game-save"         value="Save"   class="w-30 dib b dim ph3 pv2 input-reset ba bg-transparent pointer f6 b--green" >
            <input type="submit" id="game-unselectGame" value="Close"  class="w-30 dib b dim ph3 pv2 input-reset ba bg-transparent pointer f6 b--black" onclick=${onUnselect} >
            <input type="submit" id="game-deleteGame"   value="Delete" class="w-30 dib b dim ph3 pv2 input-reset ba bg-transparent pointer f6 b--red"   onclick=${onDelete} >
          </div>

        </form>
      </article>
    `
}
