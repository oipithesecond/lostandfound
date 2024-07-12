const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine', 'ejs')

app.get("/", function (req, res) {
  fs.readdir(`./items`,function(err,items){
  res.render("index",{items:items})
  })
})
app.get("/lostupload", function(req,res){
  fs.readdir(`./items`,function(err,items){
  res.render("lostupload",{items:items})
  })
})
app.get("/item/:lostitem", function(req,res){
  res.send(`Lost Item: ${req.params.lostitem}`)
})
app.post("/create", function(req,res){
  console.log(req.body)
  fs.writeFile(`./items/${req.body.title.split(" ").join("")}.txt`, req.body.description, function(err){})
  res.redirect("/")
})
app.listen(3000, ()=>{
  console.log("Server is running on port 3000")
})