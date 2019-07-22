let jwt = require('jsonwebtoken');
const config = require('./app/config/token_config')

let checkToken = (req, res, next) => {
    let token = req.body['data']; // Express headers are auto converted to lowercase
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }

    console.log("token is : " + token)

    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Auth token is not supplied'
      });
    }
  };
  
  module.exports = {
    checkToken: checkToken
  }