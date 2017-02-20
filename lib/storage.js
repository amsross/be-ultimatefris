const r = require("ramda");
const uuid = require("uuid/v4");

const storage = store => ({
  create: (storeName, cb) => {
    const game = {
      "id": uuid(),
      "name": "",
      "date": new Date(),
      "location": "Haddonfield, NJ",
    };
    return cb(game);
  },
  read: (storeName, cb) => {
    try {
      cb(JSON.parse(store[storeName]));
    } catch (e) {
      cb([]);
    }
  },
  update: (storeName, game, cb) => {
    storage(store).read(storeName, games => {
      games = r.reject(r.propEq("id", game.id), games);
      games = games.concat(game);

      store[storeName] = JSON.stringify(games);
      cb(games);
    })
  },
  delete: (storeName, game, cb) => {
    storage(store).read(storeName, games => {
      games = r.reject(r.propEq("id", game.id), games);

      store[storeName] = JSON.stringify(games);
      cb(games);
    })
  },
});

module.exports = storage;
