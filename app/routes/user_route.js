const router = require('express').Router();
const User = require('../models/User')
var db = require('../config/db_config');
const Bmrked_post = require('../models/Bmrked_post')

// Create a new User
router.post('/', (req, res) => {
  console.log(req.body)
    if (req.body.password != req.body.confirmPassword)
    {
      res.status(500).json({msg: "Passwords do not match."})
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

// Retrieve all Users
router.get('/', (req, res) => {
    User.findAll()
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
    User.findAll({
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
          res.status(200).json( { mgs: "Updated Successfully -> Username is now = " + new_username } );
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
    db.query("SELECT * FROM bmrked_posts INNER JOIN users_bmrked ON bmrked_posts.ntt_no = users_bmrked.ntt_no AND users_bmrked.username = $1", { 
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
  const ntt_no = req.body.ntt_no;

  // first add new user - bookmarked post relationship
  db.query("INSERT INTO users_bmrked (username, ntt_no) VALUES ($1, $2)", {
    bind: [username, ntt_no], type: db.QueryTypes.INSERT}, (err, results) => {
      if (err) {
        return res.status(500).json({msg: "error", details: err})
      }
    })
  
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
        res.status(500).json({msg: "error2", details: err})
    })
})

// delete a bookmark post for logged in user
router.delete('/:username/:ntt_no', (req, res) => {
  const username = req.params.username;
  const ntt_no = req.params.ntt_no;

  // delete from user_bmrked
  db.query("DELETE FROM users_bmrked WHERE users_bmrked.username = $1 AND users_bmrked.ntt_no = $2", {
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

module.exports = router;