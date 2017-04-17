const sheetify = require('sheetify')
const choo = require('choo')
const logger = require('choo-log')
const Home = require('./pages/home')
const app = choo()

app.use(logger())
app.use(require('./models/api'))

sheetify('./public/css/leaflet.css')
sheetify('tachyons')
app.route('/', Home)
app.mount('body')
