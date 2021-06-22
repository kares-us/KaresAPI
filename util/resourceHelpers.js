const { formatPhoneNumber } = require('./dataFormatters')

function formatResourceData(data) {
    for (var key in data) {
        if (data[key] === '' || data[key] === null) {
            if (key === 'name' || key === 'tag') return Error(`Cannot leave ${key} empty.`)
        }
    }

    if (data.phone) {
        data.phone = formatPhoneNumber(data.phone)
        if (data.phone === null) return Error(`Phone number format error.`)
    }

    return data
}

module.exports = {
    formatResourceData
}