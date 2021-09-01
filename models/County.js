const mongoose = require('mongoose')

const countySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    design: {
        type: Object,
        required: true,
        default: {
            navbar: '#535557',
            primaryText: '#DCE3EF',
            secondaryText: '#2f3136',
            button: '#85cbff',
        }
    }
})

module.exports = mongoose.model('County', countySchema)