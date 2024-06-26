const path = require('path')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine', 'ejs')

app.get("/", function (req, res) {
  res.render("index")
})
app.get("/item/:lostitem", function(req,res){
  res.send(`Lost Item: ${req.params.lostitem}`)
})

app.listen(3000)