var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const User = require('./app/models/User');
const config = require('./app/config/token_config')
const jwt = require('jsonwebtoken');
// const middleware = require('./middleware');

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Database
const db = require('./app/config/db_config.js');

// // force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync with { force: true }');
//   });

// Login
app.post('/login', (req, res) => {
    User.findAll({
        where: {
            username: req.body.username,
            password: req.body.password
        }})
    .then(user => {
        if (!user) return res.status(403).json({
            success: false,
            message: 'Incorrect username or password'
        })
        let token = jwt.sign({id: user.username}, config.secret,
            { expiresIn: '24h' // expires in 24 hours 
        });
        // return the JWT token for the future API calls
        res.json({success: true, message: 'Authentication successful!',
            token: token})
        })
    .catch(err => res.status(400).json({
        success: false,
        message: 'Authentication failed! Please check the request'
        }))
});

// Routers
app.use('/users', require('./app/routes/user_route.js'));
app.use('/bmrked_posts', require('./app/routes/bmrked_post_route.js'));
app.use('/users_bmrked', require('./app/routes/users_bmrked_route.js'))

// Create a Server
var server = app.listen(8080, () => {
    var port = server.address().port
    console.log("App listening at http://localhost:%s", port)
})