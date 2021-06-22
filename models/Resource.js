const mongoose = require('mongoose')

const resourceSchema = new mongoose.Schema({
    county: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'County'
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    website1: {
        type: String,
        required: false
    },
    website2: {
        type: String,
        required: false
    },
    meetingTime: {
        type: String,
        required: false
    },
    tag: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Resource', resourceSchema)