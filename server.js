var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const User = require('./app/models/User');
const config = require('./app/config/token_config')
const jwt = require('jsonwebtoken');
// const middleware = require('./middleware');
const fs = require('fs')
// const path = require('path')
// const multer = require('multer')

// // Set Storage Engine
// var storage = multer.diskStorage({
// 	destination: function(req, file, cb) { //isn't this just '/uploads/' ?
// 		cb(null, './my_uploads/')
// 	},
// 	filename: function(req, file, cb) {
// 		// var originalname = file.originalname
// 		// var extension = originalname.split(".")
// 		// filename = Date.now() + '.' + extension[extension.length - 1]
// 		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
// 	}
// })

// //Initialize Upload variable
// const upload = multer({
// 	storage: storage,
// 	dest: './my_uploads/'
// })

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// getting imagefile ? (o.O) ;;
app.get('/my_uploads/:name', function (req, res) {
    var filename = req.params.name;
    fs.exists(__dirname+'/my_uploads/'+filename, function (exists) {
      if (exists) {
        fs.readFile(__dirname+'/my_uploads/'+filename, function (err, data) {
          res.end(data);
        });
      } else {
        res.end('file does not exists');
      }
    })
  });

app.use('/my_uploads', express.static('my_uploads'));

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
            token: token, user})
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