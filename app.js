const path = require('path')
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const app = express()
const itemModel = require('./models/item')

app.use(express.json())
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
  res.render("upload")
})
app.get("/items/:lostitem", function(req,res){
    res.render("lostitem")
  })
app.post('/create', upload.array('images', 10), async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    let { title, description, itemType, building, specificArea } = req.body;
    const images = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      originalname: file.originalname,
    }))
    try {
        let createdItem = await itemModel.create({ title, description, itemType, building, specificArea, images });
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
app.listen(3000, ()=>{
  console.log("Server is running on port 3000")
})