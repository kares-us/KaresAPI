const express = require('express')
const { OAuth2Client } = require('google-auth-library');
const router = express.Router()
const Admin = require('../models/Admin')
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

router.post('/create', async (req, res) => {
  const { email } = req.body
  if (!email) return sendJsonResponse(res, 401, "You must provide an email.")

  const newAdmin = new Admin({ email })

  try {
    await Admin.findOne({ email: email })
      .then(adm => {
        if (adm) return sendJsonResponse(res, 401, "Admin already exists.")
        else {
          newAdmin.save(() => sendJsonResponse(res, 200, "Successfully created admin."))
        }
      })
  } catch (e) {
    return sendJsonResponse(res, 500, e.message)
  }
})

router.post('/login', async (req, res) => {
  const { name, email, profilePicture } = req.body

  try {
    await Admin.findOne({ email })
      .then(adm => {
        if (!adm) {
          return sendJsonResponse(res, 401, "Unauthorized.")
        } else {
          adm.name = name
          adm.profilePicture = profilePicture
          adm.markModified()
          adm.save()
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

        Admin.findOne({ email: payload.email })
          .then(adm => {
            if (!adm) return sendJsonResponse(res, 401, "Unauthorized.")
            else return sendJsonResponse(res, 200, "Authenticated", adm)
          })
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