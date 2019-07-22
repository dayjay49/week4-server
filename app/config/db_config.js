// const env = require('./env.js');
 const Sequelize = require('sequelize');

 module.exports = new Sequelize('week4db', 'postgres', '1234', {
  host: 'localhost',
  dialect: 'postgres',
 
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Here we will define associations
// var User = require('../models/User')
// var Bmrked_post = require('../models/Bmrked_post')
// var User_bmrked = require('../models/User_bmrked')

// Bmrked_post - User_bmrked M:M association
// User.belongsToMany(Bmrked_post, {as: 'favPosts', through: 'User_bmrked'})

