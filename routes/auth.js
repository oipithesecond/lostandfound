const express = require('express')
const passport = require('passport')
const router = express.Router()


router.get('/auth/google', passport.authenticate('google', { scope: ['profile','email', 'openid'] }))
 

router.get('/auth/google/callback',passport.authenticate('google', { 
	successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure'
	 }),
  (req, res, next) => {
    res.redirect('/')
  }
)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

module.exports = router;