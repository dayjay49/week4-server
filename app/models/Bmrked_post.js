const Sequelize = require('sequelize');
const db = require('../config/db_config');
const Bmrked_post = db.define('bmrked_post', {
    // id: {
    //     type: Sequelize.INTEGER
    // },
    ntt_no: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    bbs_nm: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    subject: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contents: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userscount: {
        type: Sequelize.INTEGER
    }
    // createdAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false
    // },
    // updatedAt: {
    //     type: Sequelize.DATE,
    //     allowNull: false
    // }
},
{
    timestamps: false
}
)

module.exports = Bmrked_post;