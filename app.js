const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const connectDB = require("./utils/mongooseconfig")
const itemModel = require("./models/item")
const userModel = require("./models/user")
const multerConfig = require("./utils/multerconfig")
require('dotenv').config()
const {generateToken} = require("./utils/generatetoken")

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine', 'ejs')

app.get("/", isLoggedin, async (req, res) => {
  let items = await itemModel.find()
  res.render("index",{items})

})
app.get("/login", function (req, res) {
  res.render("login")
  })
app.get("/upload", isLoggedin, function(req,res){
  res.render("upload")
})
app.get("/profile/", isLoggedin, async (req,res)=>{
  let user = await userModel.findOne({email:req.user.email}).populate("posts")
  console.log(user)
  res.render("profile",{user})
})
app.get("/items/:id", isLoggedin, async (req,res)=>{
    let items = await itemModel.find({_id:req.params.id}).populate("user")
    res.render("item",{items})
  })
app.post('/usersignup', async (req,res)=>{
  let{ name, email, password } = req.body
  let user = await userModel.findOne({email})
  if(user){
    return res.status(500).send("User already registered. Try logging in instead")
  }else{
  bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(password, salt, async(err,hash) => {
        let createdUser = await userModel.create({
          name,
          email,
          password: hash,
        })
        let token = generateToken(createdUser)
        res.cookie("token", token)
        res.redirect("/")
    })
  })
}
})
app.post("/userlogin", async (req,res)=>{
  try{
  let user = await userModel.findOne({email: req.body.email})
  if(!user) return res.send("something went wrong")
  const match = await bcrypt.compare(req.body.password, user.password)
  if(match){
    let token = generateToken(user)
    res.cookie("token", token)
    return res.redirect("/")
  }else{
    res.send("password/username incorrect")
  }} catch(error){
    console.error(error)
    return res.send("an error occured")
  } 
  })
app.get('/logout',(req,res)=>{
  res.cookie("token", "")
  res.redirect("login")
})
function isLoggedin(req,res,next){
  if (!req.cookies.token) {
    return res.redirect("/login");
}

try {
    let data = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    req.user = data;
    next();
} catch (error) {
    console.error("JWT verification failed:", error);
    return res.redirect("/login");
}
}
app.post('/create', isLoggedin, multerConfig.array('images', 10), async (req, res) => {
  let user = await userModel.findOne({email: req.user.email})
    console.log(req.body);
    console.log(req.files);
    let { title, description, itemType, building, specificArea } = req.body
    const images = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      originalname: file.originalname,
    }))
    try {
        let createdItem = await itemModel.create({ title, description, itemType, building, specificArea, images, user: user._id });
        user.posts.push(createdItem._id)
        await user.save()
        res.json(createdItem)

    } catch (error) {
        console.error(error)
        res.status(500).send('Error saving data to the database.');
    }
})
app.get("/delete/:id", isLoggedin, async (req, res) => {
  let items = await itemModel.findOneAndDelete({_id:req.params.id})
  res.redirect("/profile")
})
connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}).catch(err => console.error(err));