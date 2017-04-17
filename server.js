var bankai = require('bankai')
var http = require('http')
var path = require('path')

var clientPath = path.join(__dirname, 'client.js')
var assets = bankai(clientPath)

http.createServer(function (req, res) {
  switch (req.url) {
    case '/': return assets.html(req, res).pipe(res)
    case '/bundle.js': return assets.js(req, res).pipe(res)
    case '/bundle.css': return assets.css(req, res).pipe(res)
    default: return (res.statusCode = 404) && res.end('404 not found')
  }
}).listen(process.env.PORT || 8080)
