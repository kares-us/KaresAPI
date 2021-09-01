const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AdminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    profilePicture: { type: String, required: false },
    counties: [{ type: Object, default: [] }],
    roles: [{ type: String, default: [] }]
})


module.exports = mongoose.model("Admin", AdminSchema);