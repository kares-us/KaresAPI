const jwt = require('jsonwebtoken')
const { sendJsonResponse } = require('./responseHelpers')

async function checkAuth(req, res, next) {
    let sessionToken = req.headers['session']
    let token = jwt.decode(sessionToken)

    if (token.roles.includes('County Manager') || token.roles.includes('Admin')) {
        next()
    } else sendJsonResponse(res, 401, "Unauthorized")
}

async function checkAdmin(req, res, next) {
    let sessionToken = req.headers['session']
    let token = jwt.decode(sessionToken)

    if (token.roles.includes('Admin')) {
        next()
    } else sendJsonResponse(res, 401, "Unauthorized")
}


module.exports = {
    checkAuth,
    checkAdmin
}