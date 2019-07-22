const router = require('express').Router();
const Users_bmrked = require('../models/User_bmrked')

// Retrieve all user - bookmarked post relationships
router.get('/', (req, res) => {
    Users_bmrked.findAll()
    .then(users_bmrked => {
        res.json(users_bmrked)
    }).catch(err => {
        console.log(err);
        res.status(500).json({msg: "error", details: err})
    })
})

module.exports = router;