const jwt = require('jsonwebtoken');
const apiError = require('../utils/ApiError');

module.exports.verifyToken = async function (req, res, next) {
  try {
  
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new apiError('Authorization header missing', 401);
    }

 
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new apiError('Token not found', 401);
    }

    // token verify
    const verified = jwt.verify(token, process.env.SecreteKey);
    req.user = verified;
    next();

  } catch (error) {
    next(error);
  }
};
