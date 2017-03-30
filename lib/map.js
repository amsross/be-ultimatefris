const r = require('ramda')
const html = require('choo/html')
const widget = require('cache-element/widget')
const L = require('leaflet')
const { safe } = require('crocks')

module.exports = () => {
  let map

  return widget({
    onupdate: (el, coords) => {
      if (map) {
        safe(r.all(r.is(Number)))(coords)
          .map(coords => map.setView(coords))
      }
    },
    render: (state, emit) => {
      return html`
        <div id="gmaps-map">
          <div
            style="height: 500px"
            onload=${el => initMap(el, state, emit)}></div>
        </div>
      `
    },
    onunload: removeMap
  })

  function initMap (el, state, emit) {
    map = L.map(el)
      .setView(state || [0, 0], 16)
      .addLayer(L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18
      }))

    map.on('move', r.compose(
      latLng => emit('moveMap', latLng),
      r.props(['lat', 'lng']),
      r.invoker(0, 'getCenter'),
      r.prop(['target'])))
  }

  function removeMap (el) {
    if (map) {
      map.remove()
      map = null
    }
  }
}
