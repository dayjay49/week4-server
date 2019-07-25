const Sequelize = require('sequelize');
const db = require('../config/db_config');

const User_bmrked = db.define('users_bmrked', {
    username: {
        type: Sequelize.STRING
    },
    ntt_no: {
        type: Sequelize.INTEGER
    }
})

module.exports = User_bmrked;