const express = require('express')
const router = express.Router()
 const {ensureAuth, ensureGuest} = require('../middleware/ensureAuth')
 const authController = require('../controller/authLocal')
 const Blog = require('../model/blogSchema')


//@route     GET/
//desc       home page
 router.get('/', ensureGuest, (req, res)=>{
    res.render('login', {
        layout: "login"
    })
 })


 //@route  GET/dashboard
 //desc    dashoard page
 router.get('/dashboard', ensureAuth, async(req, res)=>{
  try {
    const blogs = await Blog.find({user: req.user.id}).lean() 
    res.render("dashboard",{
       name: req.user.username,
       blogs
   })
  } catch (error) {
   console.error(err)
      res.render("error/500")
  }

 })

//@desc   login page
//route   GET/login
router.get("/login", authController.getLogin)

//@desc   signup page
//route   GET/signup
  router.get("/signup", authController.getSignup)


//@desc   login page
//route   POST/login
  router.post("/login", authController.postLogin)


//@desc   login page
//route   POST/login
 router.post('/signup', authController.postSignup)

//@desc   login page
//route   GET/logout
  router.get('/logout', authController.logout)
 

 
 




module.exports = router