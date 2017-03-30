const r = require('ramda')
const uuid = require('uuid/v4')

const storage = store => ({
  create: (storeName, cb) => {
    const game = {
      'id': uuid(),
      'name': '',
      'date': new Date().toISOString(),
      'location': 'Haddonfield, NJ'
    }
    return cb(game)
  },
  read: (storeName, cb) => {
    try {
      cb(JSON.parse(store[storeName]))
    } catch (e) {
      cb([])
    }
  },
  update: (storeName, game, cb) => {
    storage(store).read(storeName, r.compose(
      r.tap(cb),
      r.tap(games => { store[storeName] = JSON.stringify(games) }),
      r.append(game),
      r.reject(r.propEq('id', game.id))))
  },
  delete: (storeName, game, cb) => {
    storage(store).read(storeName, r.compose(
      r.tap(cb),
      r.tap(games => { store[storeName] = JSON.stringify(games) }),
      r.reject(r.propEq('id', game.id))))
  }
})

module.exports = storage
