const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

class validateToken {
  // function to get customer compnay orders
  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JwtPrivate_Pass);
      let data = {
        isValid: true,
        token: decoded
      }
      return data
    }
    catch (ex) {
      let data = {
        isValid: false,
        token: ''
      }
      return data;
    }
  }




}

module.exports = new validateToken();