const Sequelize = require('sequelize');
const db = require('../config/db_config');

const User = db.define('user', {
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    phonenumber: {
        type: Sequelize.STRING
    },
    imagepath: {
        type: Sequelize.TEXT
    }
})

// var Bmrked_post = require('../models/Bmrked_post')
// var User_bmrked = require('../models/User_bmrked')
// User.associate = () => {
//     User.belongsToMany(Bmrked_post, {through: 'User_bmrked'})
// }

module.exports = User;