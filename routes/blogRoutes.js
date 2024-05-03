const express = require('express')
const router =  express.Router()
const {ensureAuth, ensureGuest} = require('../middleware/ensureAuth')
const blogController = require('../controller/blogController')
const multer = require('../middleware/multer')


//@route   GET/add
 //@Desc    add page
 router.get('/add', ensureAuth, (req, res)=>{
    res.render('stories/add')
 })

 //@route   GET /
 //@Desc    show all stories
router.get("/", ensureAuth, blogController.getFeed)

 //@createPost    desc
 //@route    Post/createBlog
 router.post("/", multer.single('file'), blogController.createPost)

 //@Update    desc
 //@route    Put/stories/:id
router.put("/:id", ensureAuth, blogController.updatePost)

//@route   Delete/stories/:id
 //@Desc    delete blog
 router.delete('/:id', ensureAuth, blogController.deletePost)

 //@route   GET /stories/edit/:id
 //@Desc    edit page
 router.get('/edit/:id', ensureAuth, blogController.getEdit)


 //@route   GET /stories/:id
 //@Desc    show single page
router.get('/:id', ensureAuth, blogController.showSingle)


 //@route   GET /stories/edit/:id
 //@Desc   user stories
router.get('/user/:userId', ensureAuth, blogController.userBlogs)


module.exports = router