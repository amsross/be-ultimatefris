const tapSpec = require('tap-spec')
const run = require('tape-run')
const browserify = require('browserify')

browserify([
  `${__dirname}/test/models/api.js`
  // `${__dirname}/test/pages/home.js`,
  // `${__dirname}/test/views/game.js`,
  // `${__dirname}/test/views/games-list.js`,
  // `${__dirname}/test/views/header.js`,
  // `${__dirname}/test/views/map.js`
])
  .bundle()
  .pipe(run())
  .pipe(tapSpec())
  .pipe(process.stdout)
