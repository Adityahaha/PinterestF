var express = require('express');
var router = express.Router();
const userModel=require("./users")
const postModel=require("./post")
const passport = require('passport');
const localStrategy = require("passport-local");
const upload = require("./multer");
passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index',{nav:false})
});

router.get('/register', function(req, res, next) {
  res.render('register',{nav:false})
});

router.post('/register', function(req, res, next) {
  const data = new userModel({
    username:req.body.username,
    name:req.body.name,
    email:req.body.email

  })
  userModel.register(data, req.body.password)
  .then(function(){
     passport.authenticate("local")(req,res,()=>{
      res.redirect("/profile");
  })
})
});


router.get("/profile",isLoggedIn,async (req,res,next)=>{
  const user = await userModel
  .findOne({username:req.session.passport.user})
  .populate("posts")
  console.log(user);
  
  res.render("profile",{user,nav: true})
})

router.post("/fileupload", upload.single("image"),async (req,res,next)=>{
  const user = await userModel.findOne({username:req.session.passport.user})
  user.profileImage = req.file.filename; // jo naam se save hui hai file wo ye hai aur ye file profileimage me dal do
  await user.save();
  res.redirect("/profile")
})

router.get('/add' ,isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user})
  res.render("add",{user,nav:true})
});



router.post('/createpost' ,upload.single("postimage"), async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user})
  const post = await postModel.create({
    user:user._id,
    title:req.body.title,
    description:req.body.description,
    postimage:req.file.filename,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/",
}))


router.get("/logout", (req,res,next)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/index");
}













module.exports = router;
