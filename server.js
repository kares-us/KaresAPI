require('dotenv').config()

// Require all libraries
const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

// Setup Database
const mongoURI = process.env.MONGODB_URI
const localURI = process.env.LOCAL_MONGODB_URI

const dbURI = mongoURI

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('Connected to database.'))

// Apply and use all middleware
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://www.kares.us");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

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