const express = require('express')
const router = express.Router()
const Admin = require('../models/Admin')
const County = require('../models/County')

const { checkAuth, checkAdmin } = require('../util/middleware')

router.get('/get_all', checkAdmin, async (req, res) => {
    try {
        await Admin.find()
            .then(adm => {
                if (!adm) return res.status(200).json({ type: 'Success', message: 'No admin accounts were found' })
                return res.status(200).json({ type: 'Success', message: 'Successfully fetched admin accounts.', data: adm })
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.post('/create_account', async (req, res) => {
    const newAdmin = new Admin({
        email: req.body.email,
        name: req.body.name,
        profilePicture: req.body.picture
    })

    try {
        await Admin.findOne({ email: req.body.email })
            .then(adm => {
                if (adm) {
                    return adm.save()
                        .then(existingAdmin => res.status(200).json({ type: 'Success', message: 'Successfully created account.', data: existingAdmin }))
                }
                newAdmin.save()
                    .then(newAdm => res.status(200).json({ type: 'Success', message: 'Successfully created account.', data: newAdm }))
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})


router.get('/get_admin/:email', async (req, res) => {
    const { email } = req.params

    try {
        await Admin.findOne({ email })
            .then(adm => {
                if (!adm) {
                    return res.status(404).json({ type: 'Error', message: 'Admin does not exist.' })
                }
                return res.status(200).json({ type: 'Success', message: 'Successfully fetched admin', data: adm })
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.patch('/update/:email', checkAdmin, async (req, res) => {
    const { email } = req.params
    const { county, countyName, roles } = req.body

    try {
        await Admin.findOne({ email })
            .then(adm => {
                if (!adm) return res.status(404).send({ type: 'Error', message: 'Admin not found' })
                else {
                    if (county != null) {
                        adm.county = county
                        adm.countyName = countyName
                    }
                    if (roles != null) adm.roles = roles
                    adm.save()
                        .then(admin => res.status(200).json({ type: 'Success', message: 'Successfully updated admin.', data: admin }))
                }
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})

router.delete('/delete/:email', checkAdmin, async (req, res) => {
    const { email } = req.params

    try {
        await Admin.findOne({ email })
            .then(adm => {
                if (!adm) return res.status(404).send({ type: 'Error', message: 'Admin not found' })
                adm.remove()
                    .then(() => res.status(200).json({ type: 'Success', message: 'Successfully deleted admin.' }))
            })
    } catch (e) {
        return res.status(500).json({ type: 'Error', message: e.message })
    }
})



module.exports = router