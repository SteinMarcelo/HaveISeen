const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

const hashPassword = async (password, salt) => {
  return await bcrypt.hash(password + salt, 10);
};

const verifyPassword = async (password, salt, hashedPassword) => {
  return await bcrypt.compare(password + salt, hashedPassword);
};

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '24h'
  });
};

module.exports = {
  generateSalt,
  hashPassword,
  verifyPassword,
  generateToken
};