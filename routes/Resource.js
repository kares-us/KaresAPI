const express = require('express')
const router = express.Router()
const Resource = require('../models/Resource')

const { formatPhoneNumber } = require('../util/dataFormatters')
const { sendJsonResponse } = require('../util/responseHelpers')
const { checkAdmin } = require('../util/middleware')

router.post('/create', checkAdmin, async (req, res) => {
    let data = req.body
    let { name, county, tag, phone } = data

    if (!name || !county || !tag) return sendJsonResponse(res, 400, 'Missing Info. Insure Name, County, and Tag are fulfilled.')

    if (phone) data.phone = formatPhoneNumber(phone)
    if (phone === null) return sendJsonResponse(res, 400, 'Bad phone number format.')

    const newResource = new Resource(data)

    try {
        await Resource.findOne({ name })
            .then(rsce => {
                if (rsce) return sendJsonResponse(res, 400, `Resource already exists with name: '${name}'`)
                else newResource.save(() => sendJsonResponse(res, 200, "Resource created successfully."))
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})


router.patch('/update/:id', checkAdmin, async (req, res) => {
    const data = req.body
    let { name, phone, address, website1, website2, additionalInformation, tag } = data
    console.log(additionalInformation)
    const { id } = req.params

    try {
        await Resource.findById(id)
            .then(rsce => {
                if (!rsce) return sendJsonResponse(res, 404, `Resource not found with name: ${name}`)
                else {
                    if (phone) {
                        phone = formatPhoneNumber(phone)
                        if (phone !== null) rsce.phone = phone
                        else return sendJsonResponse(res, 400, 'Could not format phone number.')
                    }
                    if (address !== null) rsce.address = address
                    if (website1 != null) rsce.website1 = website1
                    if (website2 != null) rsce.website2 = website2
                    if (additionalInformation != null) rsce.additionalInformation = additionalInformation
                    if (tag != null) rsce.tag = tag

                    rsce.save(() => sendJsonResponse(res, 200, 'Successfully updated resource'))
                }
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.delete('/delete/:id', checkAdmin, async (req, res) => {
    const { id } = req.params

    try {
        await Resource.findById(id)
            .then(rsce => {
                if (!rsce) return sendJsonResponse(res, 404, "Resource not found.")
                rsce.remove(() => sendJsonResponse(res, 200, "Successfully removed resource."))
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.get('/county/:id', async (req, res) => {
    try {
        await Resource.find({ county: req.params.id })
            .then(resources => sendJsonResponse(res, 200, "Successfully fetched resources.", resources))
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

module.exports = router