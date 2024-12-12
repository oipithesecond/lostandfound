const path = require('path')
const fs = require('fs')
const express = require('express')
require('dotenv').config()
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')

const app = express()

const connectDB = require("./utils/mongooseconfig")
const itemModel = require("./models/item")
const userModel = require("./models/user")
// const multerConfig = require("./utils/multerconfig")
const { upload, compressAndSaveImages } = require("./utils/multerconfig");
require('./utils/passport')(passport)
const {generateToken} = require("./utils/generatetoken")
const { ensureAuth, ensureGuest } = require('./middleware/newAuth')
const postLimiter = require('./middleware/PostrateLimiter')
const bugLimiter = require('./middleware/BugrateLimiter')
// const Auth = require('./middleware/oldAuth')
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.set('trust proxy', 1)
app.set('view engine', 'ejs')
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
  })
)
app.use(passport.initialize())
app.use(passport.session())
const authRoutes = require('./routes/auth'); 
app.use(authRoutes)

app.get("/", ensureAuth, async (req, res) => {
  try {
    let items = await itemModel.find();
    res.render("home", { items });
  } catch (error) {
    console.error("Error fetching items:", error);
    // res.status(500).send("Error loading the homepage.")
    res.render("rateLimitExceeded")
  }
})
app.get("/login", ensureGuest, function (req, res) {
  res.render("login")
  })
app.get("/upload", ensureAuth, function(req,res){
  res.render("upload")
})
app.get("/uploadlost", ensureAuth, function(req,res){
  res.render("uploadlost")
})
app.get("/profile/", ensureAuth, async (req,res)=>{
  try {
    let user = await userModel.findOne({ email: req.user.email }).populate("posts");
    res.render("settings", { user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // res.status(500).send("Error loading the profile page.");
    res.render("rateLimitExceeded")
  }
})
app.get("/items/:id", ensureAuth, async (req,res)=>{
    let items = await itemModel.find({_id:req.params.id}).populate("user")
    res.render("item",{items,req})
})

app.post('/create', ensureAuth, postLimiter, upload.array('images', 10), compressAndSaveImages, async (req, res) => {
  try {
  let user = await userModel.findOne({email: req.user.email})
    let { title, description, itemType, building, specificArea } = req.body
    const images = req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      originalname: file.originalname,
    }))
        let createdItem = await itemModel.create({ title, description, itemType, building, specificArea, images, user: user._id });
        user.posts.push(createdItem._id)
        await user.save()
        res.json(createdItem)

    } catch (error) {
        console.error(error)
        // res.status(500).send('Error saving data to the database.');
        res.render("rateLimitExceeded")
    }
})
app.get("/delete/:id", ensureAuth, async (req, res) => {
  try {
    let item = await itemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).send("Item not found.");
    }

    item.images.forEach(image => {
      const filePath = path.join(__dirname, image.path); 
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          res.render("rateLimitExceeded")
        }
      });
    });

    await itemModel.findByIdAndDelete(req.params.id);
    res.redirect("/profile");
  } catch (error) {
    console.error("Error deleting item:", error);
    // res.status(500).send("Error deleting the item.");
    res.render("rateLimitExceeded")
  }
})
app.post('/submit-bug-report', ensureAuth, bugLimiter, (req, res) => {
  const issueType = req.body['issue-type']
  const description = req.body.description
  const reporterName = req.user.lastName

  const report = `Reporter: ${reporterName}\nIssue Type: ${issueType}\nDescription: ${description}\n\n`

  const filePath = path.join(__dirname, 'issues.txt')

  fs.appendFile(filePath, report, (err) => {
    if (err) {
      // res.status(500).send('An error occurred while submitting the bug report.')
      res.render("rateLimitExceeded")
    } else {
      res.redirect('/');
    }
  });
});

app.get('/rate-limit-exceeded', ensureAuth, (req,res) => {
  res.render('rateLimitExceeded')
})


const PORT =  process.env.PORT || 80
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Server started on defined port');
  });
}).catch(err=>{
  console.error("Database connection failed:", err);
})