const test = require("tape");
const storage = require("../../lib/storage");
const sampleStore = {
  "games": JSON.stringify([{
    "id": "6881426f-d008-4f85-86c5-d331b1384637",
    "name": "sample game 1",
    "date": new Date(),
    "location": "New York, NY",
  }, {
    "id": "635a6662-1914-49ca-ae3c-a26eb5ceaba5",
    "name": "sample game 2",
    "date": new Date(),
    "location": "Haddonfield, NJ",
  }])
};

test("lib/storage", assert => {

  assert.test("create", assert => {
    storage(sampleStore).create("games", game => {
      assert.ok(new RegExp(/[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/i).test(game.id), "id is uuid")
      assert.equal(game.name, "", "no default name set");
      assert.equal(game.location, "Haddonfield, NJ", "default location is set");

      assert.end();
    });
  });

  assert.test("read", assert => {
    storage(sampleStore).read("games", games => {
      assert.ok(games instanceof Array, "array of games");
      assert.equal(games.length, 2, "only the predefined games were returned");
      assert.equal(games[0].id, "6881426f-d008-4f85-86c5-d331b1384637", "predefined game was returned");

      assert.end();
    });
  });

  assert.test("update", assert => {
    const game = {
      "id": "6881426f-d008-4f85-86c5-d331b1384637",
      "name": "new name",
      "date": new Date(),
      "location": "new location",
    };
    storage(sampleStore).update("games", game, games => {
      assert.ok(games instanceof Array, "array of games");
      assert.equal(games[1].id, "6881426f-d008-4f85-86c5-d331b1384637", "predefined game was returned");
      assert.equal(games[1].name, "new name", "updated name was returned");
      assert.equal(games[1].location, "new location", "updated location was returned");

      assert.end();
    });
  });

  assert.test("delete", assert => {
    const game = {
      "id": "6881426f-d008-4f85-86c5-d331b1384637",
    };
    storage(sampleStore).delete("games", game, games => {
      assert.ok(games instanceof Array, "array of games");
      assert.equal(games.length, 1, "only one of the the predefined games was returned");
      assert.equal(games[0].id, "635a6662-1914-49ca-ae3c-a26eb5ceaba5", "predefined game was returned");

      assert.end();
    });
  });

  assert.end();
});
