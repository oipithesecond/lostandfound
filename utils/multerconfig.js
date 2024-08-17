const path = require('path')
// const crypto = require('crypto')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/itemimage')
    },
    // filename: function (req, file, cb) {
    //     crypto.randomBytes(12, function(err,name){
    //         const uniqueSuffix = name.toString("hex") + path.extname(file.originalname)
    //         cb(null, file.fieldname + '-' + uniqueSuffix)
    //     })
    // }
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix); 
    }
  })

  const upload = multer({ storage: storage })
  module.exports = upload