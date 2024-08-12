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
  try {
    let items = await itemModel.find();
    res.render("home", { items });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).send("Error loading the homepage.");
  }
})
app.get("/login", function (req, res) {
  res.render("login")
  })
app.get("/upload", isLoggedin, function(req,res){
  res.render("upload")
})
app.get("/profile/", isLoggedin, async (req,res)=>{
  try {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render("profile", { user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send("Error loading the profile page.");
  }
})
app.get("/items/:id", isLoggedin, async (req,res)=>{
    let items = await itemModel.find({_id:req.params.id}).populate("user")
    res.render("item",{items})
})
app.post('/usersignup', async (req,res)=>{
  try {
    let { name, email, password } = req.body;
        const namePattern = /^[a-zA-Z\s]+$/;
        if (!namePattern.test(name)) {
        return res.status(400).send("Name can only contain letters and spaces.");
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@vitapstudent\.ac\.in$/;
        if (!emailPattern.test(email)) {
          return res.status(400).send("Please use a valid VIT-AP student email address.");
        }
        const passwordPattern = /^\S{5,}$/;
        if(!passwordPattern.test(email)) {
          return res.status(400).send("Password must be at least 5 characters long and cannot contain spaces.")
        }
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(409).send("User already registered. Try logging in instead.");
    }

    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err;
        try {
          let createdUser = await userModel.create({
            name,
            email,
            password: hash,
          });
          let token = generateToken(createdUser);
          res.cookie("token", token);
          res.redirect("/");
        } catch (error) {
          console.error("Error creating user:", error);
          res.status(500).send("Error creating user.");
        }
      });
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).send("Error during signup.");
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
    let { title, description, itemType, building, specificArea } = req.body
    const images = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      originalname: file.originalname,
    }))
    // try {
        let createdItem = await itemModel.create({ title, description, itemType, building, specificArea, images, user: user._id });
        user.posts.push(createdItem._id)
        await user.save()
        res.json(createdItem)

    // } catch (error) {
    //     console.error(error)
    //     res.status(500).send('Error saving data to the database.');
    // }
})
app.get("/delete/:id", isLoggedin, async (req, res) => {
  try {
    let item = await itemModel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found.");
    }
    res.redirect("/profile");
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("Error deleting the item.");
  }
})
connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}).catch(err=>{
  console.error("Database connection failed:", err);
})