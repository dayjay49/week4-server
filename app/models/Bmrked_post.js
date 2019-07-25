const Sequelize = require('sequelize');
const db = require('../config/db_config');
const Bmrked_post = db.define('bmrked_post', {
    // id: {
    //     type: Sequelize.INTEGER
    // },
    ntt_no: {
        type: Sequelize.INTEGER
    },
    subject: {
        type: Sequelize.STRING
    },
    contents: {
        type: Sequelize.STRING
    },
    userscount: {
        type: Sequelize.INTEGER
    }
},
// {
//     timestamps: false
// }
)

module.exports = Bmrked_post;