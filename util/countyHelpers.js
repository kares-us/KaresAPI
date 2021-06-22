function formatCountyData(data) {
    const { name, design } = data

    if (name === '' || name === null) return Error(`Cannot leave name empty.`)

    for (key in design) {
        if (design[key][0] !== '#') return Error(`${key} must be a hex value.`)
    }

    return data
}

module.exports = {
    formatCountyData
}