const express = require('express')
const router = express.Router()
const County = require('../models/County')
const Visitor = require('../models/Visitor')
const Admin = require('../models/Admin')
const { formatSimpleFormInfo, formatAdvancedFormInfo } = require('../util/visitorHelpers')

router.post('/mark_fulfilled/:id', async (req, res) => {
    const { id } = req.params

    try {
        await Visitor.findById(id)
            .then(vis => {
                if (!vis) return res.status(404).json({ type: 'Error', message: 'Visitor Not Found' })
                else {
                    vis.requestFulfilled = true
                    vis.markModified()
                    vis.save()
                        .then(vis1 => res.status(200).json({ type: 'Success', message: 'Successfully marked visitor fulfilled', data: vis1 }))
                }
            })
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

router.post('/archive_visitor/:id', async (req, res) => {
    const { id } = req.params

    try {
        await Visitor.findById(id)
            .then(vis => {
                if (!vis) return res.status(404).json({ type: 'Error', message: 'Visitor Not Found' })
                else {
                    vis.archived = true
                    vis.markModified()
                    vis.save()
                        .then(vis1 => res.status(200).json({ type: 'Success', message: 'Successfully marked visitor as archived', data: vis1 }))
                }
            })
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

router.post('/submit_simple_form', async (req, res) => {
    const data = req.body

    const newData = formatSimpleFormInfo(data)

    if (newData.message) return res.status(400).json({ type: 'Error', message: newData.message })

    newData.county = newData.county._id

    const newVisitor = new Visitor(newData)

    try {
        await Visitor.findOne({ phone: newData.phone })
            .then(vis => {
                if (vis) {
                    if (String(vis.county) !== String(newData.county)) return res.status(400).json({ type: 'Error', message: 'Visitor already exists in different county.' })
                    vis.additionalInfo = req.body.additionalInfo
                    vis.requestFulfilled = false
                    vis.markModified()
                    return vis.save()
                        .then(newVis => res.status(200).json({ type: 'Success', message: 'Successfully created visitor.', data: newVis }))
                }
                return newVisitor.save()
                    .then(newVis => res.status(200).json({ type: 'Success', message: 'Successfully created visitor.', data: newVis }))
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })

    }
})


router.post('/submit_advanced_form', async (req, res) => {
    const data = req.body

    const newData = formatAdvancedFormInfo(data)

    if (newData.message) return res.status(400).json({ type: 'Error', message: newData.message })

    newData.county = newData.county._id

    const newVisitor = new Visitor(newData)

    try {
        await Visitor.findOne({ phone: newData.phone })
            .then(vis => {
                if (vis) {
                    if (String(vis.county) !== String(newData.county)) return res.status(400).json({ type: 'Error', message: 'Visitor already exists in different county.' })
                }
                return newVisitor.save()
                    .then(newVis => res.status(200).json({ type: 'Success', message: 'Successfully created visitor.', data: newVis }))
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

module.exports = router