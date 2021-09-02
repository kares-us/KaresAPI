const express = require('express')
const { OAuth2Client } = require('google-auth-library');
const router = express.Router()
const Admin = require('../models/Admin')
const whitelistedAdmins = require('../data/admins.json')
const { sendJsonResponse } = require('../util/responseHelpers')

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.get('/', async (req, res) => {
    try {
        await Admin.find()
            .then(admins => {
                return sendJsonResponse(res, 200, "Successfully fetched admins.", admins)
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.post('/login', async (req, res) => {
    const { name, email, profilePicture } = req.body

    if (!whitelistedAdmins.includes(email)) return sendJsonResponse(res, 401, "Unauthorized.")

    try {
        await Admin.findOne({ email })
            .then(adm => {
                if (!adm) {
                    const newAdmin = new Admin({ email, name, profilePicture })
                    newAdmin.save()
                        .then(() => sendJsonResponse(res, 200, "Successfully signed in."))
                } else {
                    return sendJsonResponse(res, 200, "Successfully signed in.")
                }
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.post('/token', async (req, res) => {
    const { token } = req.body

    try {
        await client.verifyIdToken({ idToken: token })
            .then(ticket => {
                const payload = ticket.getPayload()

                if (whitelistedAdmins.includes(payload.email)) {
                    Admin.findOne({ email: payload.email })
                        .then(adm => {
                            return sendJsonResponse(res, 200, "Authenticated", adm)
                        })
                } else {
                    return sendJsonResponse(res, 401, "Unauthorized.")
                }
            })
            .catch(e => {
                return sendJsonResponse(res, 500, "Cannot verify token.")
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.patch('/update/:id', async (req, res) => {
    const { id } = req.params
    const { counties, roles } = req.body

    try {
        await Admin.findById(id)
            .then(adm => {
                if (!adm) return sendJsonResponse(res, 404, "Admin not found.")
                else {
                    if (counties != null) adm.counties = counties
                    if (roles != null) adm.roles = roles

                    adm.save().then(() => { sendJsonResponse(res, 200, "Successfully updated admin.") })
                }
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})



module.exports = router