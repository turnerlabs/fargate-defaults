const cors = require('cors')
const express = require('express')
const fs = require('fs')
const morgan = require('morgan')
const main = require('./lib')
const dd = require('./lib/datadog')

const app = express()
const port = process.env.PORT || 12789

let version = 'not set'

fs.readFile('./package.json', (err, data) => {
    if (err) throw err

    let pkg = JSON.parse(data)
    version = pkg.version
})

app.set('x-powered-by', false)
app.set('etag', false)

app.use(cors())

app.get('/_hc', (req, res) => res.json({version}))

app.use(morgan('short'))

// See Datadog results directly
app.get('/v1/cpu/:shipment/:environment', dd.init, dd.rawCpu, main.send)
app.get('/v1/cpu/:shipment/:environment/:timeframe', dd.init, dd.rawCpu, main.send)
app.get('/v1/ram/:shipment/:environment/', dd.init, dd.rawMemory, main.send)
app.get('/v1/ram/:shipment/:environment/:timeframe', dd.init, dd.rawMemory, main.send)

// See currated results
app.get('/v1/:shipment/:environment', dd.init, dd.cpu, dd.memory, main.send)
app.get('/v1/:shipment/:environment/:from-:to', dd.init, dd.cpu, dd.memory, main.send)
app.get('/v1/:shipment/:environment/:timeframe', dd.init, dd.cpu, dd.memory, main.send)

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    let code = err.code || err.status || 500

    res.status(code)
    res.json({ error: true, code, message: err.message || err || "Something went wrong" })
})

app.use((req, res) => {
    let code = 404
    res.status(code)
    res.json({ error: true, code, message: `path "${req.path}" does not exist` })
})

if (process.env.DATADOG_API_KEY && process.env.DATADOG_APP_KEY) {
    app.listen(port, () => console.log('listening on %s', port))
}
else {
    console.error('Required keys for Datadog are not available')
    process.exit(1)
}
