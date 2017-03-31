const r = require('ramda')
const { safeLift } = require('crocks')
const tap = require('../lib/pull-tap')
const pull = require('pull-stream')
const debounce = require('pull-debounce')
const geocoder = require('geocoder-geojson')
const Push = require('pull-pushable')
const storage = require('../lib/storage')
const store = r.tryCatch(
  x => x(window.localStorage),
  e => storage({
    'games': []
  }))(storage)

const reducers = {
  selectGame: (state, emit) => {
    return setupListener(pull(
      pull.map(game => {
        state.game = game
        state.coords = r.ifElse(r.equals(state.coords),
          r.always(state.coords),
          r.compose(
            r.map(Number),
            r.reject(r.isNil),
            r.unnest, r.of))(r.prop('coords', game))
        return state
      }),
      tap(state => emit.emit('updateCoords', state.coords)),
      tap(() => emit.emit('render'))))
  },
  unselectGame: (state, emit) => {
    return setupListener(pull(
      tap(() => { state.game = null }),
      tap(() => emit.emit('render'))))
  },
  updateCoords: (state, emit) => {
    return setupListener(pull(
      tap(coords => safeLift(r.none(r.isNil), r.compose(
        r.unless(r.equals(state.coords),
          coords => {
            state.coords = coords
          }),
        r.map(Number)))(coords))))
  },
  receiveGames: (state, emit) => {
    return setupListener(pull(
      tap(games => {
        state.games = games
        if (r.path(['game', 'id'], state)) {
          state.game = r.converge(r.call, [
            r.compose(
              r.find,
              r.propEq('id'),
              r.path(['game', 'id'])),
            r.prop('games')
          ])(state)
        }
      }),
      tap(() => emit.emit('render'))))
  }
}

const effects = {
  updateLocation: (state, emit) => {
    return setupListener(pull(
      debounce(740),
      tap(location => {
        state.game = r.set(r.lensProp('location'), location, state.game)
      }),
      pull.asyncMap((location, cb) => geocoder.google(location, {short: true})
        .then(points => cb(null, points))),
      pull.map(r.compose(
        r.reverse,
        r.unnest, r.of,
        r.path(['geometry', 'coordinates']),
        r.head,
        r.prop('features'))),
      tap(coords => {
        state.game = r.set(r.lensProp('coords'), coords, state.game)
      }),
      tap(coords => emit.emit('selectGame', state.game))))
  },
  moveMap: (state, emit) => {
    return setupListener(pull(
      debounce(250),
      tap(coords => r.unless(r.equals(state.coords),
        coords => {
          emit.emit('updateCoords', coords)
          emit.emit('readGames')
        })(coords))
    ))
  },
  createGame: (state, emit) => {
    return setupListener(pull(
      pull.asyncMap((data, cb) => store.create('games', game => cb(null, game))),
      tap(game => emit.emit('selectGame', game))))
  },
  readGames: (state, emit) => {
    return setupListener(pull(
      pull.asyncMap((data, cb) => store.read('games', games => cb(null, games))),
      tap(games => emit.emit('receiveGames', games))))
  },
  updateGame: (state, emit) => {
    return setupListener(pull(
      pull.asyncMap((game, cb) => store.update('games', game, games => cb(null, games))),
      tap(games => emit.emit('receiveGames', games))))
  },
  deleteGame: (state, emit) => {
    return setupListener(pull(
      pull.asyncMap((game, cb) => store.delete('games', game, games => cb(null, games))),
      tap(games => emit.emit('receiveGames', games))))
  }
}

function setupListener (through) {
  const push = Push()
  pull(
    push,
    tap(x => { if (x === 'push:nil') push.close() }),
    through,
    pull.drain(() => {}))
  return push.push
}

module.exports = (state, emitter) => {
  state.coords = state.coords || [0, 0]
  state.games = state.games || []
  state.game = state.game || null

  r.mapObjIndexed((reducer, event) => {
    emitter.on(event, reducer(state, emitter))
  }, reducers)

  r.mapObjIndexed((effect, event) => {
    emitter.on(event, effect(state, emitter))
  }, effects)
}
