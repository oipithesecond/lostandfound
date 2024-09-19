const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 1, 
  handler: function (req, res) {
    res.status(429).json({ message: 'Rate limit exceeded' })
  }
})

module.exports = limiter