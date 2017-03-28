const html = require('choo/html')

module.exports = function view (state, emit) {
  return html`
    <nav class="w-100 border-box pa3 ph5 bg-light-gray">
      <div class="v-mid w-100 tr">
        <a class="f6 link dim br3 ph3 pv2 mb2 dib ba bw1 dark-green" title="Create" onclick=${() => emit('createGame')}>Create</a>
      </div>
    </nav>
    `
}
