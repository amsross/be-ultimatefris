const sheetify = require('sheetify')
const choo = require('choo')
const Home = require('./pages/home')
const app = choo()

if (process.env.NODE_ENV !== 'production') {
  const logger = require('choo-log')
  app.use(logger())
}
app.use(require('./models/api'))

sheetify('./public/css/leaflet.css')
sheetify('tachyons')
app.route('/', Home)
app.mount('body')
