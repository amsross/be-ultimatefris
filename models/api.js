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
      return r.compose(
        r.when(r.compose(r.not, r.isNil, r.path(["game", "id"])),
          r.converge(r.assoc("game"), [
            r.compose(
              r.find(r.propEq("id", r.path(["game", "id"], state))),
              r.prop("games")),
            r.identity,
          ])),
        r.assoc("games", games))(state);
    },
    selectGame: (state, game) => {
      return r.assoc("game", game, state);
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
    updateGame: (state, game, send, done) => {
      store.update("games", game, games => send("receiveGames", games, done));
    },
    deleteGame: (state, game, send, done) => {
      store.delete("games", game, game => send("receiveGames", game, done));
    },
  },
};
