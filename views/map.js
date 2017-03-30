'use strict'
const Map = require('../lib/map')
const mapWidget = Map()

module.exports = function view (state, emit) {
  return mapWidget(state.coords, emit)
}
