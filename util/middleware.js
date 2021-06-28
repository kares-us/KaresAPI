const Admin = require('../models/Admin')

async function checkAuth(req, res, next) {
    let email = req.header('session')

    try {
        await Admin.findOne({ email })
            .then(adm => {
                if (!adm) {
                    return res.status(401).json({ type: 'Error', message: 'Unauthorized.' })
                }

                if (adm.roles.includes('Admin') || adm.roles.includes('County Manager')) {
                    next()
                } else return res.status(401).json({ type: 'Error', message: 'Unauthorized.' })

            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
}

async function checkAdmin(req, res, next) {
    let email = req.header('session')

    try {
        await Admin.findOne({ email })
            .then(adm => {
                if (!adm) {
                    return res.status(401).json({ type: 'Error', message: 'Unauthorized.' })
                }

                if (adm.roles.includes('Admin')) {
                    next()
                } else return res.status(401).json({ type: 'Error', message: 'Unauthorized.' })

            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
}


module.exports = {
    checkAuth,
    checkAdmin
}