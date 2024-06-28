const fs = require('fs');
const http = require('http');
const express = require('express')
const app = express()

app.use(function(req,res,next){
    console.log("middleware started")
    next()
})

app.get("/", function (req, res) {
  res.send('Hello World')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

app.listen(3000)