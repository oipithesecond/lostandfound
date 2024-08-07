const path = require('path')
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const app = express()
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const connectDB = require("./models/main")
const itemModel = require("./models/item")
const userModel = require("./models/user")

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
const upload = multer({ dest: './itemimage' })
app.use('/itemimage', express.static(path.join(__dirname, 'itemimage')));
app.set('view engine', 'ejs')

app.get("/", async (req, res) => {
  let items = await itemModel.find()
  res.render("index",{items})

})
app.get("/login", function (req, res) {
  res.render("login")
  })
app.get("/upload", function(req,res){
  let data = jwt.verify(req.cookies.token, "secret")
  console.log(data)
  res.render("upload")
})
app.get("/profile/:id", async (req,res)=>{
  let users = await userModel.find({_id:req.params.id})
  res.render("profile",{users})
})
app.get("/items/:id", async (req,res)=>{
    let items = await itemModel.find({_id:req.params.id})
    res.render("item",{items})
  })
app.post('/usersignup',(req,res)=>{
  let{ name, email, password } = req.body
  bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(password, salt, async(err,hash) => {
        let createdUser = await userModel.create({
          name,
          email,
          password: hash,
        })
        let token = jwt.sign({email}, "secret key")
        res.cookie("token", token)
        res.redirect("/")
    })
  })
})
app.post("/userlogin", async (req,res)=>{
  try{
  let user = await userModel.findOne({email: req.body.email})
  if(!user) return res.send("something went wrong")
  const match = await bcrypt.compare(req.body.password, user.password)
  if(match){
    let token = jwt.sign({email: user.email}, "secret key")
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
app.post('/create', upload.array('images', 10), async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    let { title, description, itemType, building, specificArea } = req.body
    const images = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      originalname: file.originalname,
    }))
    try {
        let createdItem = await itemModel.create({ title, description, itemType, building, specificArea, images, uploadDate, user });
        user.posts.push(item._id)
        await user.save()
        res.json(createdItem)

    } catch (error) {
        console.error(error)
        res.status(500).send('Error saving data to the database.');
    }
})
app.get("/delete/:id", async (req, res) => {
  let items = await itemModel.findOneAndDelete({_id:req.params.id})
  res.redirect("/")
})
connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
}).catch(err => console.error(err));