const Blog = require("../model/blogSchema")
const cloudinary = require("../middleware/cloudinary")

module.exports = {
   getFeed: async(req, res)=>{
      try {
         const blogs = await Blog.find({status: 'public'})
         .populate('user')
         .sort({createdAt: 'desc'})
         .lean()

         res.render('stories/index', {
            blogs
         })
      } catch (error) {
        console.error(error);
        res.render('error/500')
      }
   },
   createPost: async(req, res) => {
     try {
        req.body.user = req.user.id;
        const results = await cloudinary.uploader.upload(req.file.path)
        const blog = await Blog.create({
            ...req.body, 
            cloudinaryId: results.public_id,
            image: results.secure_url
        })
        if (!blog) {
            return res.status(400).json({ error: 'Failed to create blog post' });
        }
        res.redirect('/dashboard')
     } catch (error) {
        console.log(error)
     }
     res.render('stories/add')
   },
   getEdit: async(req, res)=>{
      try {
          const blogs = await Blog.findOne({_id: req.params.id}).lean()

          if(!blogs){
            return res.render('error/400')
          }

          if(blogs.user != req.user.id){
            res.redirect('/stories')
          }else{
            res.render('stories/edit', {
                blogs
            })
          }

      } catch (error) {
        console.error(error);
        res.render("error/500")
      }
   },

   updatePost: async(req, res)=>{
    try {
        let blogs  = await Blog.findById(req.params.id).lean()
 
    if(!blogs){
     return res.render('error/400') 
  }
 
  if(blogs.user != req.user.id){
      res.redirect('/stories')
  }else{
      blogs = await Story.findOneAndUpdate({_id: req.params.id}, req.body, {
         new: true,
         runValidators: true
      })
      res.redirect('/dashboard')
  } 
     } catch (error) {
         console.error(error)
         return res.render('error/500')
     
     }
    
   },
   
   deletePost: async(req, res)=>{
    try {
        let blogs = await Blog.findById(req.params.id).lean()
        if(!blogs){
            return res.render('error/404') 
         }
        
         if(blogs.user != req.user.id){
             res.redirect('/stories')
         }else{
            await cloudinary.uploader.destroy(blogs.cloudinaryId)
            await Blog.deleteOne({_id: req.params.id}) 
            res.redirect('/dashboard') 
         }
    } catch (error) {
        console.error(error)
        return res.render('error/500')
    }
   }, 
   showSingle: async(req, res)=>{
    try {
        let blogs = await Blog.findById(req.params.id).populate('user').lean()
    
        if (!blogs) {
          return res.render('error/404')
        }
    
        if (blogs.user._id != req.user.id && blogs.status == 'private') {
          res.render('error/404')
        } else {
          res.render('stories/show', {
            blogs,
          })
        }
      } catch (err) {
        console.error(err)
        res.render('error/404')
      }
   },

   userBlogs: async(req, res)=>{
    try {
        const blogs = await Blog.find({
          user: req.params.userId,
          status: 'public',
        })
          .populate('user')
          .lean()
    
        res.render('stories/index', {
          blogs,
        })
      } catch (err) {
        console.error(err)
        res.render('error/500')
      }
   }
}