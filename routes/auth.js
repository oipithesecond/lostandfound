const express = require('express')
const passport = require('passport')
const router = express.Router()


router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email', 'openid'] }))
 

router.get('/auth/google/callback',passport.authenticate('google', { 
	successRedirect: '/', 
  failureRedirect: '/login'
	 })
)

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect('/')
  })
})

module.exports = router;