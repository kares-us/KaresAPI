const express = require('express')
const router = express.Router()
const County = require('../models/County')
const Resource = require('../models/Resource')

const { formatResourceData } = require('../util/resourceHelpers')

router.post('/create', async (req, res) => {
    const data = req.body
    const newResource = new Resource(data)

    if (data.name === '' || data.tag === '' || data.county === '') return res.status(400).json({ type: 'Error', message: 'Can\'t leave name, tag, or county empty' })

    try {
        await Resource.findOne({ name: data.name })
            .then(resource => {
                if (resource) return res.status(403).send({ type: 'Error', message: 'Resource already exists.' })
                County.findById(data.county)
                    .then(county => {
                        newResource
                            .save()
                            .then(() => {
                                county.resources.push(newResource)
                                county.markModified('resources')
                                county.save()
                                return res.status(200).json({ type: 'Success', message: 'Successfully created resource.' })
                            })
                    })

            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})


router.patch('/update/:id', async (req, res) => {
    const data = req.body
    const { id } = req.params

    try {
        await Resource.findById(id)
            .then(resource => {
                if (!resource) return res.status(404).send({ type: 'Error', message: 'Resource not found' })
                else {
                    const newData = formatResourceData(data)

                    if (newData.name != null) resource.name = newData.name
                    if (newData.phone != null) resource.phone = newData.phone
                    if (newData.address != null) resource.address = newData.address
                    if (newData.website1 != null) resource.website1 = newData.website1
                    if (newData.website2 != null) resource.website2 = newData.website2
                    if (newData.meetingTime != null) resource.meetingTime = newData.meetingTime
                    if (newData.tag != null) resource.tag = newData.tag

                    if (newData.message) return res.status(400).json({ type: 'Error', message: newData.message })
                    else {
                        resource.save()
                        return res.status(200).json({ type: 'Success', message: 'Successfully updated resource.' })
                    }
                }
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params

    try {
        await Resource.findById(id)
            .then(resource => {
                County.findById(resource.county)
                    .then(county => {
                        for (res in county.resources) {
                            if (parseInt(county.resources[res]._id) === parseInt(resource._id)) {
                                const index = county.resources.indexOf(county.resources[res]._id)
                                county.resources.splice(index, 1)
                                county.markModified('resources')
                                county.save()
                            }
                        }
                    })
                resource.remove()
                return res.send(200).json({ type: 'Success', message: 'Sucessfully removed resource.' })
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.get('/get_county_resources/:id', async (req, res) => {
    const { id } = req.params

    try {
        await Resource.find({ county: id })
            .then(resources => res.status(200).json({ type: 'Success', message: 'Sucessfully fetched all resources.', data: resources }))
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

module.exports = router