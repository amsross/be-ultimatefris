const html = require("choo/html");

module.exports = function view(state, prev, send) {

  const mapper = item => html`
      <article class="dt w-100 bb b--black-05 pb2 mt2">
        <div class="dtc w2 w3-ns v-mid">
          <img src="https://unsplash.it/200" class="ba b--black-10 db br2 w2 w3-ns h2 h3-ns"/>
        </div>
        <div class="dtc v-mid pl3">
          <h1 class="f6 f5-ns fw6 lh-title black mv0">${item.name}</h1>
          <h2 class="f6 fw4 mt0 mb0 black-60">${item.location}</h2>
        </div>
        <div class="dtc v-mid tr">
          <a class="f6 link dim br3 ph3 pv2 mb2 dib ba bw1 dark-green" onclick=${() => send("selectGame", item)}>View</a>
        </div>
      </article>
    `;

  return html`
      <div class="flex-auto">
        ${state.games.map(mapper)}
      </div>
    `;
};

