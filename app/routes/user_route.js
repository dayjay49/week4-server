const router = require('express').Router();
const User = require('../models/User')
var db = require('../config/db_config');
const Bmrked_post = require('../models/Bmrked_post')
const User_bmrked = require('../models/User_bmrked')
const Op = require('sequelize').Op
const path = require('path')
const multer = require('multer')

// Set Storage Engine
var storage = multer.diskStorage({
	destination: function(req, file, cb) { //isn't this just '/uploads/' ?
		cb(null, './my_uploads/')
	},
	filename: function(req, file, cb) {
		// var originalname = file.originalname
		// var extension = originalname.split(".")
		// filename = Date.now() + '.' + extension[extension.length - 1]
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
	}
})

//Initialize Upload variable
const upload = multer({
	storage: storage,
	dest: './my_uploads/'
})

// Create a new User
router.post('/', (req, res) => {
  console.log(req.body)
    if (req.body.password != req.body.confirmPassword)
    {
      res.status(500).json({msg: "Passwords do not match."})
    }
    else if ((req.body.password == '') || (req.body.confirmPassword == '')) {
      res.status(500).json({msg: "Password and/or confirm password fields cannot be empty."})
    }
    else {
      // Save to PostgreSQL database
      User.create(req.body)
      .then(user => {
          // Send created user to client
          res.json(user)
      }).catch(err => {
          console.log(err);
          res.status(500).json({msg: "error", details: err})
      })
    }
});

// Retrieve all Users but self
router.get('/:username', (req, res) => {
  const username = req.params.username;
    User.findAll({
      where: {
        username: {
          [Op.ne]: username
        }
      }
    })
        .then(users => {
            // Send all users to client
            res.json(users)
        }).catch(err => {
            console.log(err)
            res.status(500).json({msg: "error", details: err})
        })
});

// Retrieve a single User by username
router.get('/:username', (req, res) => {  
    User.findOne({
      where: {
        username: req.params.username
      }
    })
    .then(user => {
        res.json(user[0]);
      }).catch(err => {
        console.log(err);
        res.status(500).json({msg: "error", details: err});
      });
  });

// Update a User with username
router.put('/', (req, res) => {
    const new_username = req.body.username;
    User.update( req.body, 
        { where: {username: new_username} }).then(() => {
          res.status(200).json( { msg: "Updated Successfully -> Username is now = " + new_username } );
        }).catch(err => {
          console.log(err);
          res.status(500).json({msg: "error", details: err});
        });
  });

// Delete a User with username
router.delete('/:username', (req, res) => {
    const username = req.params.username;
    User.destroy({
        where: { username: username }
      }).then(() => {
        res.status(200).json( { msg: 'Deleted Successfully -> User with username = ' + username } );
      }).catch(err => {
        console.log(err);
        res.status(500).json({msg: "error", details: err});
      });
  });

// Retrieve all bookmarked post for logged in user
router.get('/:username/bmrked_posts', (req, res) => {
    const username = req.params.username;
    db.query("SELECT * FROM bmrked_posts INNER JOIN users_bmrkeds ON bmrked_posts.ntt_no = users_bmrkeds.ntt_no AND users_bmrkeds.username = $1", { 
        bind: [ username ], type: db.QueryTypes.SELECT})
      .then(bmrked_posts => {
          res.json(bmrked_posts)
        }).catch(err => {
          console.log(err);
          res.status(500).json({msg: "error", details: err});
        })
})

// add a bookmark post for logged in user
router.post('/:username/bmrked_posts', (req, res) => {
  console.log(req.body)
  const username = req.params.username;
  console.log("username is: " + username)
  const ntt_no =  req.body.ntt_no;
  console.log("ntt_no is: " + ntt_no)

  // first add new user - bookmarked post relationship
  User_bmrked.create({username: username, ntt_no: ntt_no})
      .then(() => {
        Bmrked_post.findAll({
          where: { ntt_no: ntt_no }
          }).then(bmrked_post => {
              // if ntt_no not in bmrked_posts, add to bmrked_posts
              if (bmrked_post.length == 0) {
                  Bmrked_post.create(req.body)
                  .then(post => {
                      console.log("IT WORKED!!")
                      res.json(post)
                  }).catch(err => {
                    console.log(err);
                    res.status(500).json({msg: "error", details: err});
                  })
              }
              // else, userCount +1
              else {
                  console.log(bmrked_post[0])
                  bmrked_post[0].increment('userscount');
                  res.json(bmrked_post[0])
              }
          }).catch(err => {
            console.log("ERRORROROROR 1")
              res.status(500).json({msg: "error2", details: err})
          })
      }).catch(err => {
        console.log("ERRROROROROROR 2")
          res.status(500).json({msg: "error", details: err})
      })

  // db.query("INSERT INTO users_bmrked (username, ntt_no) VALUES ($1, $2)", {
  //   bind: [username, ntt_no], type: db.QueryTypes.INSERT}, (err, results) => {
  //     if (err) {
  //       return res.status(500).json({msg: "error", details: err})
  //     }
  //   })
  
  // Bmrked_post.findAll({
  //   where: { ntt_no: ntt_no }
  //   }).then(bmrked_post => {
  //       // if ntt_no not in bmrked_posts, add to bmrked_posts
  //       if (bmrked_post.length == 0) {
  //           Bmrked_post.create(req.body)
  //           .then(post => {
  //               console.log("IT WORKED!!")
  //               res.json(post)
  //           }).catch(err => {
  //             console.log(err);
  //             res.status(500).json({msg: "error", details: err});
  //           })
  //       }
  //       // else, userCount +1
  //       else {
  //           console.log(bmrked_post[0])
  //           bmrked_post[0].increment('userscount');
  //           res.json(bmrked_post[0])
  //       }
  //   }).catch(err => {
  //       res.status(500).json({msg: "error2", details: err})
  //   })
})

// delete a bookmark post for logged in user
router.delete('/:username/:ntt_no', (req, res) => {
  const username = req.params.username;
  const ntt_no = req.params.ntt_no;

  // delete from user_bmrked
  db.query("DELETE FROM users_bmrkeds WHERE users_bmrkeds.username = $1 AND users_bmrkeds.ntt_no = $2", {
    bind: [username, ntt_no], type: db.QueryTypes.DELETE}, (err, results) => {
      if (err) {
        return res.status(500).json({msg: "error", details: err})
      }
    })

  Bmrked_post.findOne({
      where: { ntt_no: ntt_no }
  }).then(unbmrked_post => {
      console.log("AHHHHHHH AHHHHHH IDK T-T")
      console.log(unbmrked_post)

      // if current user is the last person to bookmark this post, remove post from
      // bookmarked post table
      if (unbmrked_post.getDataValue('userscount') == 1) {
          Bmrked_post.destroy({
            where: { ntt_no: ntt_no }
          }).then(() => {
            res.json({msg: "bookmarked post unbookmarked AND removed from bookmarked_posts table."})
          }).catch(err => {
            console.log(err);
            res.status(500).json({msg: "error1", details: err});
          })
      } 
      // else, simply usersCount -1
      else {
        unbmrked_post.decrement('userscount')
        res.json({msg: "bookmark removed for current user"})
      } 
  }).catch(err => {
      res.status(500).json({msg: "error2", details: err})
  })
})

// upload profile pic for current user (update image path for user)
router.post('/:username/photo', upload.single('imageFile'), (req, res) => {
  console.log("THE REQUEST ITSELF IS: " + req)
  console.log("THE REQUEST FILE CONSOLE LOG" + req.file)
  const photo_path = req.file.path
  console.log("the file path is -> ", photo_path)
  const username = req.params.username
  User.findOne({
      where: { username: username}
  }).then(user => {
      user.update({
          imagepath: photo_path
      }).then(() => {
          res.status(200).json({msg: "Added profile image path for current user"})
      }).catch(err => {
          console.log(err);
            res.status(500).json({msg: "error", details: err});
      })
  }).catch(err => {
      console.log("User with given username NOT FOUND....")
      res.status(500).json({msg: "error", details: err})
  })
})

module.exports = router;