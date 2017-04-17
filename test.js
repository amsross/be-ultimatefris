const tapSpec = require('tap-spec')
const run = require('tape-run')
const browserify = require('browserify')

browserify([
  `${__dirname}/test/models/api.js`
])
  .bundle()
  .pipe(run())
  .pipe(tapSpec())
  .pipe(process.stdout)
