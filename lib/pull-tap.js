const map = require('pull-stream/throughs/map')

module.exports = function tap (mapper) {
  return map(x => {
    mapper(x)
    return x
  })
}
