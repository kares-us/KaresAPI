const express = require('express')
const router = express.Router()
const Visitor = require('../models/Visitor')

const { formatPhoneNumber, formatEmail } = require('../util/dataFormatters')
const { sendJsonResponse } = require('../util/responseHelpers')
const { checkAuth } = require('../util/middleware')


router.get('/county/:id', checkAuth, async (req, res) => {
    let { id } = req.params

    try {
        await Visitor.find({ county: id })
            .then(visitors => sendJsonResponse(res, 200, "Successfully fetched visitors.", visitors))
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.post('/submit_simple', async (req, res) => {
    let data = req.body
    let { county, name, email, phone } = req.body

    if (!county) return sendJsonResponse(res, 400, "You must select a county.")
    if (!name) return sendJsonResponse(res, 400, "You must enter a name.")
    if (!phone) return sendJsonResponse(res, 400, "You must enter a phone number.")
    if (formatPhoneNumber(phone) === null) return sendJsonResponse(res, 400, "Bad phone number format.")
    data.phone = formatPhoneNumber(phone)
    if (email) {
        if (formatEmail(email) === null) return sendJsonResponse(res, 400, "Bad email format.")
        data.email = formatEmail(email)
    }

    const newVisitor = new Visitor(data)

    try {
        await Visitor.findOne({ email })
            .then(vis => {
                if (vis) return sendJsonResponse(res, 400, "Visitor already exists.")
                newVisitor.save(() => sendJsonResponse(res, 200, "Successfully submitted form."))
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})


router.post('/submit_advanced', async (req, res) => {
    const data = req.body
    const { county, name, phone } = data

    if (!county) return sendJsonResponse(res, 400, "You must select a county.")
    if (!name) return sendJsonResponse(res, 400, "You must enter a name.")
    if (!phone) return sendJsonResponse(res, 400, "You must enter a phone number.")
    if (formatPhoneNumber(phone) === null) return sendJsonResponse(res, 400, "Bad phone number format.")
    data.phone = formatPhoneNumber(phone)
    if (email) {
        if (formatEmail(email) === null) return sendJsonResponse(res, 400, "Bad email format.")
        data.email = formatEmail(email)
    }

    const newVisitor = new Visitor(data)

    try {
        await Visitor.findOne({ social: newData.social })
            .then(vis => {
                if (vis) return sendJsonResponse(res, 400, "Visitor already exists.")
                newVisitor.save(() => sendJsonResponse(res, 200, "Successfully submitted form."))
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.post('/mark_fulfilled/:id', checkAuth, async (req, res) => {
    const { id } = req.params

    try {
        await Visitor.findById(id)
            .then(vis => {
                if (!vis) return sendJsonResponse(res, 404, "Visitor does not exist.")
                else {
                    vis.requestFulfilled = true
                    vis.save().then(() => sendJsonResponse(res, 200, "Successfully marked visitor fulfilled."))
                }
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.post('/archive_visitor/:id', checkAuth, async (req, res) => {
    const { id } = req.params

    try {
        await Visitor.findById(id)
            .then(vis => {
                if (!vis) return sendJsonResponse(res, 404, "Visitor does not exist.")
                else {
                    vis.archived = true
                    vis.save().then(() => sendJsonResponse(res, 200, "Successfully archived visitor."))
                }
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.delete('/delete/:id', checkAuth, async (req, res) => {
    const { id } = req.params

    try {
        await Visitor.findById(id)
            .then(vis => {
                if (!vis) return sendJsonResponse(res, 404, "Visitor does not exist.")
                vis.remove().then(() => sendJsonResponse(res, 200, "Successfully deleted visitor."))
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

module.exports = router