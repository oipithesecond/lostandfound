const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 1, 
  handler: function (req, res) {
    res.redirect('/rate-limit-exceeded')
  }
})

module.exports = limiter