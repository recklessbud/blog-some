const express = require('express')
const mongoose = require("mongoose")
const MongoStore = require('connect-mongo')
const session = require('express-session')
const morgan = require("morgan")
const MethodOverride = require('method-override')
const flash = require("connect-flash")
const passport = require('passport')
// const cloudinary = require('cloudinary')

const {formatDate, truncate, stripTags, editIcon, select} = require('./helpers/hbs')


const exphbs = require("express-handlebars").create({
    helpers:{
        formatDate,
        truncate,
        stripTags,
        select, 
        editIcon
       },
    defaultLayout: "main",
    extname: '.hbs'
})

const mainRoutes = require('./routes/mainRoutes')
const googleRoutes = require("./routes/googleAuth")
const blogRoutes = require('./routes/blogRoutes')

 
const connectDB = require('./config/database')

require("dotenv").config({path: './config/.env'})
const apps = express()

const PORT = process.env.PORT || 7970
require('./config/passport')

 connectDB()

//  apps.use(cors())

apps.engine('.hbs', exphbs.engine);
apps.set('view engine', '.hbs');

 // use json
 apps.use(express.json())

 //extend
 apps.use(express.urlencoded({extended: true}))

 //static files
 apps.use(express.static('public'))

 apps.use(MethodOverride (function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
  } 
})) 

 
apps.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
    })
  ); 
 


//use morgan in dev mode
if (process.env.NODE_ENV === "development") {
    apps.use(morgan('dev'))
 }

// passport config
apps.use(passport.initialize());
apps.use(passport.session()); 

apps.use(flash())

apps.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
  })


apps.use('/', mainRoutes)
apps.use('/auth', googleRoutes)
apps.use("/stories", blogRoutes)

apps.listen(PORT, ()=>{
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})