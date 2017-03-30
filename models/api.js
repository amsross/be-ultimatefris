const r = require('ramda')
const tap = require('../lib/pull-tap')
const pull = require('pull-stream')
const debounce = require('pull-debounce')
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
        state.coords = r.compose(
          r.map(Number),
          r.reject(r.isNil),
          r.unnest,
          r.of)(r.prop('coords', game))
        return state;
      }),
      tap(state => emit.emit('updateCoords', state.coords))))
  },
  unselectGame: (state, emit) => {
    return setupListener(pull(
      tap(() => { state.game = null }),
      tap(() => emit.emit('render'))))
  },
  updateCoords: (state, emit) => {
    return setupListener(pull(
      tap(coords => {
        if (r.equals(state.coords, coords)) {
          state.coords = r.map(Number, coords)
          emit.emit('readGames')
        } else emit.emit('render')
      })))
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
  moveMap: (state, emit) => {
    return setupListener(pull(
      debounce(250),
      tap(coords => emit.emit('updateCoords', coords))))
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
