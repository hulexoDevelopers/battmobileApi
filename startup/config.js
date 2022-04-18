 require('dotenv').config();

module.exports = function () {
  if (!process.env.JwtPrivate_Key) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
  else if (!process.env.DB_HOST) {
    throw new Error('FATAL ERROR: Host is not defined.');
  }
  else if (!process.env.DB_NAME) {
    throw new Error('FATAL ERROR: Database name is not defined.');
  }
}