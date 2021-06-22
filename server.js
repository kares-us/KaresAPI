require('dotenv').config()

// Require all libraries
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

// Setup Database
const localDB = process.env.MONGODB_URI

mongoose.connect(localDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('Connected to database.'))

// Apply and use all middleware
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())

// Routers
// Declare Routers
const adminRouter = require('./routes/Admin')
const countyRouter = require('./routes/County')
const visitorRouter = require('./routes/Visitor')
const resourceRouter = require('./routes/Resource')



// Use Routers
app.use('/admin', adminRouter)
app.use('/county', countyRouter)
app.use('/visitor', visitorRouter)
app.use('/resource', resourceRouter)




app.listen(process.env.PORT || 80, () => {
    console.log(`Server has started on port ${process.env.PORT || 80}.`)
})