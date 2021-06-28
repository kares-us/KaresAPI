const express = require('express')
const router = express.Router()
const County = require('../models/County')
const Visitor = require('../models/Visitor')
const Resource = require('../models/Resource')
const Admin = require('../models/Admin')

const { checkAuth, checkAdmin } = require('../util/middleware')

const { formatCountyData } = require('../util/countyHelpers')

router.get('/get_all', async (req, res) => {
    try {
        await County.find()
            .then(counties => {
                if (!counties) {
                    return res.status(200).json({ type: 'Error', message: 'No counties were found.' })
                }
                return res.status(200).json({ type: 'Success', message: 'Successfully fetched all counties.', data: counties })
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.get('/get_admin_county/:email', checkAuth, async (req, res) => {
    const { email } = req.params

    try {
        await Admin.findOne({ email })
            .then(adm => {
                if (!adm) {
                    return res.status(404).json({ type: 'Error', message: 'Admin does not exist.' })
                }
                console.log(adm)
                County.find({ _id: { $in: adm.counties }})
                    .then(cnty => res.status(200).json({ type: 'Success', message: 'Successfully fetched admin counties.', data: cnty }))

            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.get('/get_county/:id', checkAuth, async (req, res) => {
    const { id } = req.params

    try {
        await County.findById(id)
            .then(cnty => {
                if (!cnty) {
                    return res.status(200).json({ type: 'Error', message: 'No county was found.' })
                }
                return res.status(200).json({ type: 'Success', message: 'Successfully fetched county.', data: cnty })
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.get('/get_visitors/:id', checkAuth, async (req, res) => {
    const { id } = req.params

    try {
        await Visitor.find({ county: id })
            .then(vistrs => {
                if (!vistrs) {
                    return res.status(200).json({ type: 'Error', message: 'No visitors were found.' })
                }
                return res.status(200).json({ type: 'Success', message: 'Successfully fetched visitors.', data: vistrs })
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.post('/create', checkAdmin, async (req, res) => {
    const data = req.body

    const newCounty = new County(data)

    try {
        await County.findOne({ name: data.name })
            .then(cnty => {
                if (cnty) {
                    return res.status(400).json({ type: 'Error', message: 'County already exists.' })
                }
                newCounty.save()
                    .then(newCnty => {
                        return res.status(200).json({ type: 'Success', message: 'Successfully created county.', data: newCnty })
                    })
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.get('/get_resources/:id', async (req, res) => {
    const { id } = req.params

    try {
        await Resource.find({ county: id })
            .then(resources => {
                return res.status(200).json({ type: 'Success', message: 'Successfully fetched resources.', data: resources })
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.patch('/update/:id', checkAdmin, async (req, res) => {
    const data = req.body

    const { id } = req.params

    try {
        await County.findById(id)
            .then(cnty => {
                if (!cnty) {
                    return res.status(404).send({ type: 'Error', message: 'County not found' })
                }

                const newData = formatCountyData(data)
                const newDataDesign = newData.design

                if (newData.name != null) cnty.name = newData.name
                if (newDataDesign.navbar != null) cnty.design.navbar = newDataDesign.navbar
                if (newDataDesign.primaryText != null) cnty.design.primaryText = newDataDesign.primaryText
                if (newDataDesign.secondaryText != null) cnty.design.secondaryText = newDataDesign.secondaryText
                if (newDataDesign.button != null) cnty.design.button = newDataDesign.button

                if (newData.message) {
                    return res.status(400).json({ type: 'Error', message: newData.message })
                }

                cnty.save()
                return res.status(200).json({ type: 'Success', message: 'Successfully updated county.', data: cnty })

            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})



module.exports = router