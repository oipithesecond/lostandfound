const path = require('path')
const fs = require('fs')
const multer = require('multer')
const sharp = require('sharp')
// const crypto = require('crypto')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const compressAndSaveImages = async (req, res, next) => {
  if (!req.files) {
    return next();
  }

  try {
    await Promise.all(
      req.files.map(async (file) => {
        const outputFilename = `public/images/itemimage/${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpeg`;

        await sharp(file.buffer)
          .resize(800) 
          .jpeg({ quality: 70 }) 
          .toFile(outputFilename);

        file.path = outputFilename;
        file.filename = path.basename(outputFilename);
      })
    );
    next();
  } catch (error) {
    console.error("Error processing images:", error);
    res.status(500).send("Error processing images.");
  }
};

module.exports = { upload, compressAndSaveImages };


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/images/itemimage')
//     },
//     // filename: function (req, file, cb) {
//     //     crypto.randomBytes(12, function(err,name){
//     //         const uniqueSuffix = name.toString("hex") + path.extname(file.originalname)
//     //         cb(null, file.fieldname + '-' + uniqueSuffix)
//     //     })
//     // }
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
//       cb(null, file.fieldname + '-' + uniqueSuffix); 
//     }
//   })


  // module.exports = upload