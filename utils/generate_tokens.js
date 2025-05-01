// utils/generate_token.js
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config/keys');

const generate_token = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    JWT_KEY,
    { expiresIn: '30d' } // Token expires in 30 days
  );
};

module.exports = { generate_token };