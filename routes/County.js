const express = require('express')
const router = express.Router()
const County = require('../models/County')

const { sendJsonResponse } = require('../util/responseHelpers')
const { formatHexColor } = require('../util/dataFormatters')
const { checkAdmin } = require('../util/middleware')

router.get('/', async (req, res) => {
    try {
        await County.find()
            .then(counties => {
                return sendJsonResponse(res, 200, 'Successfully fetched all counties.', counties)
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})


router.get('/:id', async (req, res) => {
    const { id } = req.params

    try {
        await County.findById(id)
            .then(cnty => {
                if (!cnty) return sendJsonResponse(res, 404, 'County does not exist.')
                return sendJsonResponse(res, 200, cnty)
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.post('/create', async (req, res) => {
    const data = req.body
    let { name, design } = data

    if (!name) return sendJsonResponse(res, 400, "Missing name for county.")

    for (let key in design) {
        if (formatHexColor(design[key]) === null) return sendJsonResponse(res, 400, 'Ensure all design values are in hexadecimal format.')
    }

    const newCounty = new County(data)

    try {
        await County.findOne({ name: data.name })
            .then(cnty => {
                if (cnty) return sendJsonResponse(res, 400, "County with that name already exists.")
                newCounty.save(() => sendJsonResponse(res, 200, "County successfully created."))
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})

router.patch('/update/:id', async (req, res) => {
    const data = req.body

    const { id } = req.params

    if (data.design) {
        for (let key in data.design) {
            if (formatHexColor(data.design[key]) === null) return sendJsonResponse(res, 400, 'Ensure all design values are in hexadecimal format.')
        }
    }

    try {
        await County.findById(id)
            .then(cnty => {
                if (!cnty) return sendJsonResponse(res, 404, "County does not exist.")

                if (data.design.navbar != null) cnty.design.navbar = data.design.navbar
                if (data.design.primaryText != null) cnty.design.primaryText = data.design.primaryText
                if (data.design.secondaryText != null) cnty.design.secondaryText = data.design.secondaryText
                if (data.design.button != null) cnty.design.button = data.design.button
                
                cnty.markModified("design")
                cnty.save().then(() => sendJsonResponse(res, 200, "County successfully updated."))
            })
    } catch (e) {
        return sendJsonResponse(res, 500, e.message)
    }
})



module.exports = router