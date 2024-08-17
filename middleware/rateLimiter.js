const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1, 
  message: 'Please wait 1 minutes before posting again',
})

module.exports = limiter