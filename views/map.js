"use strict";
const html = require("choo/html");
const Map = require("../lib/map");
const mapWidget = Map();

module.exports = function view(state, prev, send) {

  return html`
      <div>
        ${mapWidget(state, prev, send)}
      </div>
    `;
};
