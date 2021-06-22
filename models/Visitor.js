const mongoose = require('mongoose')

const visitorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    county: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'County'
    },
    countyName: {
        type: String,
        required: true
    },
    additionalInfo: {
        type: Object,
        required: true,
        default: {}
    },
    requestFulfilled: {
        type: Boolean,
        required: true,
        default: true
    },
    archived: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Visitor', visitorSchema)