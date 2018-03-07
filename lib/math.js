const math = require('mathjs')

function getCpuUnit(int) {
    let len = int.toString().length
    let unit = 'K'

    if (len >= 12) {
        int = math.round(int / 1000000000000, 2)
        unit = 'T'
    }
    else if (len >= 9) {
        int = math.round(int / 1000000000, 2)
        unit = 'G'
    }
    else if (len >= 6) {
        int = math.round(int / 1000000, 2)
        unit = 'M'
    }
    else {
        int = math.round(int / 1000, 2)
    }

    return `${int} ${unit}`
}

function getRamUnit(int) {
    let len = int.toString().length
    let unit = 'KiB'

    if (len >= 12) {
        int = math.round(int / 1000000000000, 2)
        unit = 'TiB'
    }
    else if (len >= 9) {
        int = math.round(int / 1000000000, 2)
        unit = 'GiB'
    }
    else if (len >= 6) {
        int = math.round(int / 1000000, 2)
        unit = 'MiB'
    }
    else {
        int = math.round(int / 1000, 2)
    }

    return `${int} ${unit}`
}

/**
 * Transform an object to integer string
 *
 * obj - s: int, is in scientific notation
 *       e: int, spot in array that begins the value
 *       c: arr, items to join together for value
 *
 * returns a string
 */
function transform(obj) {
    let int;

    if (typeof obj === 'object') {
        int = obj.c.slice(0, obj.e + 1).join('')
    }
    else {
        int = obj.toString().split('.')[0]
    }

    return int
}

module.exports = {
    cpu: o => getCpuUnit(transform(o)),
    ram: o => getRamUnit(transform(o))
}
