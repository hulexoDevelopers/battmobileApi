const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

// console.log('authoriz first')
router.use(function (req, res, next) {
  //const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.header['Authorization'];
  // const token = req.header('Authorization');  if (!token) return res.status(401).send('Access denied. No token provided.');
  let token = req.header('Authorization');
  let tok =(req.params.access_token) || (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.header['Authorization'];
  // let token = ''
  // console.log('token = ' + token)
  if(!token && tok)
  // if (tok) {
    token = tok
  // }

  try {
    const decoded = jwt.verify(token, process.env.JwtPrivate_Key);
    req.user = decoded;
    next();
  }
  catch (ex) {
    res.status(400).send('Invalid token.');
  }
});

module.exports = router;
