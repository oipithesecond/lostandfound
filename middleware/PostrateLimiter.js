const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1, 
  message: 'You can only post once every minute',
})

module.exports = limiter