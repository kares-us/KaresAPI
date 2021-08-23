const { formatPhoneNumber, formatEmail } = require("./dataFormatters")

function formatSimpleFormInfo(data) {
    for (var key in data) {
        if (key != 'email') {
            if (data[key] === '' || data[key] === null) {
                return Error(`Cannot leave ${key} empty.`)
            }
        }
    }

    if (data.phone) {
        data.phone = formatPhoneNumber(data.phone)
        if (data.phone === null) return Error('Phone number format error.')
    }

    return data
}

function formatAdvancedFormInfo(data) {
    for (var key in data) {
        if (key != 'email') {
            if (data[key] === '' || data[key] === null) {
                return Error(`Cannot leave ${key} empty.`)
            }
        }
    }

    for (var key2 in data.additionalInfo) {
        if (data.additionalInfo[key2] === '' || data.additionalInfo[key2] === null) {
            return Error(`Cannot leave ${key2} empty.`)
        }
    }

    if (data.additionalInfo.social) {
        if (data.additionalInfo.social.length != 4) return Error('Invalid Social')
    }

    if (data.additionalInfo.zipCode) {
        if (data.additionalInfo.zipCode.length != 5) return Error('Invalid Zip Code')
    }

    if (data.phone) {
        data.phone = formatPhoneNumber(data.phone)
        if (data.phone === null) return Error('Phone number format error.')
    }

    return data
}

module.exports = {
    formatSimpleFormInfo,
    formatAdvancedFormInfo
}