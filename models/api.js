const r = require("ramda");
const uuid = require("uuid/v4");
const storage = require("../lib/storage");
const store = r.tryCatch(
  x => x(window.localStorage),
  e => storage({
    "games": [],
  }))(storage);

module.exports = {
  state: {
    "games": [],
    "game": null,
  },
  reducers: {
    receiveGames: (state, games) => {
      return r.assoc("games", games, state);
    },
    selectGame: (state, game) => {
      return r.compose(
        r.converge(r.assoc("game"), [
          r.compose(
            r.either(r.find(r.propEq("id", game.id)), r.always(game)),
            r.prop("games")),
          r.identity,
        ]))(state);
    },
    unselectGame: (state) => {
      return r.assoc("game", null, state);
    },
  },
  effects: {
    createGame: (state, data, send, done) => {
      store.create("games", game => send("selectGame", game, done));
    },
    readGames: (state, data, send, done) => {
      store.read("games", games => send("receiveGames", games, done));
    },
    updateGame: (state, data, send, done) => {
      store.update("games", data, game => send("receiveGames", game, done));
    },
    deleteGame: (state, data, send, done) => {
      store.delete("games", data, game => send("receiveGames", game, done));
    },
  },
};
