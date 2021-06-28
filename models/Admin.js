const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    profilePicture: { type: String, required: false },
    county: { type: Schema.Types.ObjectId, ref: 'County' },
    countyName: { type: String },
    roles: [{ type: String, default: [] }]
})


module.exports = mongoose.model("Admin", AdminSchema);