const math = require('./math')
const ddapi = require('dogapi')
const options = {
    api_key: process.env.DATADOG_API_KEY,
    app_key: process.env.DATADOG_APP_KEY
}
ddapi.initialize(options)

function selectOffset(param = '1d') {
    let hour  = 60 * 60
    let day   = hour * 24
    let week  = day * 7
    let month = (week * 4) + (2 * day) // 30 days
    let offset;

    switch (param) {
    case '1h': offset = hour;  break
    case '1d': offset = day;   break
    case '1w': offset = week;  break
    case '1m': offset = month; break
    default: offset = day
    }

    return offset
}

function initialize(req, res, next) {
    let offset = selectOffset(req.params.timeframe)
    let now = parseInt(new Date().getTime() / 1000)
    let then = now - offset

    req.dd = {}
    req.dd.namespace = `${req.params.shipment}-${req.params.environment}`
    req.dd.timeframe = { now, then }

    if (req.params.to && req.params.from) {
        req.dd.timeframe.now = req.params.to
        req.dd.timeframe.then = req.params.from
    }

    console.log(`namespace:    ${req.dd.namespace}`)
    console.log(`offset:       ${offset}s`) // colon 17, dollar 19

    next()
}

// max:kubernetes.cpu.usage.total{$namespace}by{pod_name}
// max:kubernetes.cpu.usage.total{kube_namespace:mss-harbor-app-prod}
function getCpu(req, res, next) {
    let query = `max:kubernetes.cpu.usage.total{kube_namespace:${req.dd.namespace}}by{pod_name}`
    req.dd.query = req.dd.query || {}
    req.dd.query.cpu = query

    let start = new Date().getTime()

    ddapi.metric.query(req.dd.timeframe.then, req.dd.timeframe.now, query, (err, result) => {
        if (err) {
            return next(err)
        }

        req.dd.cpu = result.series.map(same => {
            let points = same.pointlist.map(item => math.cpu(item[1]))

            points.sort()

            return {
                min: points[0],
                max: points[points.length - 1]
            }
        })

        next()

        let timer = new Date().getTime() - start
        console.log(`cpu fetch:    ${timer}ms`)
    })
}

function getRawCpu(req, res, next) {
    let query = `max:kubernetes.cpu.usage.total{kube_namespace:${req.dd.namespace}}by{pod_name}`
    req.dd.query = req.dd.query || {}
    req.dd.query.cpu = query

    let start = new Date().getTime()

    ddapi.metric.query(req.dd.timeframe.then, req.dd.timeframe.now, query, (err, result) => {
        if (err) {
            return next(err)
        }

        req.dd = result

        next()

        let timer = new Date().getTime() - start
        console.log(`cpu fetch:    ${timer}ms`)
    })
}

// max:kubernetes.memory.usage{$namespace} by {pod_name}
function getMemory(req, res, next) {
    let query = `max:kubernetes.memory.usage{kube_namespace:${req.dd.namespace}}by{pod_name}`
    req.dd.query = req.dd.query || {}
    req.dd.query.memory = query

    let start = new Date().getTime()

    ddapi.metric.query(req.dd.timeframe.then, req.dd.timeframe.now, query, (err, result) => {
        if (err) {
            return next(err)
        }

        req.dd.memory = result.series.map(same => {
            let points = same.pointlist.map(item => math.ram(item[1]))

            points.sort()

            return {
                min: points[0],
                max: points[points.length - 1]
            }
        })

        next()

        let timer = new Date().getTime() - start
        console.log(`memory fetch: ${timer}ms`)
    })
}

function getRawMemory(req, res, next) {
    let query = `max:kubernetes.memory.usage{kube_namespace:${req.dd.namespace}}by{pod_name}`
    req.dd.query = req.dd.query || {}
    req.dd.query.memory = query

    let start = new Date().getTime()

    ddapi.metric.query(req.dd.timeframe.then, req.dd.timeframe.now, query, (err, result) => {
        if (err) {
            return next(err)
        }

        req.dd = result

        next()

        let timer = new Date().getTime() - start
        console.log(`memory fetch: ${timer}ms`)
    })
}

module.exports = {
    init: initialize,
    cpu: getCpu,
    memory: getMemory,
    rawCpu: getRawCpu,
    rawMemory: getRawMemory
}
