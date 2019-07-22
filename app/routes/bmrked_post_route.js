const router = require('express').Router();
const Bmrked_post = require('../models/Bmrked_post')
const User_Bmrked = require('../models/User_bmrked')

// Retrieve a single post by ntt_no
router.get('/:ntt_no', (req, res) => {  
    const ntt_no = req.params.ntt_no;
    Bmrked_post.findAll({
        where: {
            ntt_no: ntt_no }
        })
    .then(bmrked_post => {
        res.json(bmrked_post);
      }).catch(err => {
        console.log(err);
        res.status(500).json({msg: "error", details: err});
      });
  });

// Retrieve all bookmarked posts
router.get('/', (req, res) => {
    Bmrked_post.findAll()
        .then(bmrked_posts => {
            // Send all users to client
            res.json(bmrked_posts)
        }).catch(err => {
            console.log(err)
            res.status(500).json({msg: "error", details: err})
        })
});

// // Add a new bookmark for logged user
// router.post('/', (req, res) => {
//     console.log(req.body)
//     let username = req.body.username;
//     let ntt_no = req.body.post.ntt_no;
//     let id = req.body.post.id;

//     //add to user_bmrked
//     User_Bmrked.create({ username: username, ntt_no: ntt_no, id: id }, (err, results) => {
//         if (err) {
//             return res.status(500).json({msg: "error", details: err})
//         }
//     })
//     // if ntt_no not in bmrked_posts, add to bmrked_posts
//     Bmrked_post.findAll({
//         where: { ntt_no: ntt_no }
//     }).then(bmrked_post => {
//         console.log(bmrked_post)
//         if (!bmrked_post[0]) {
//             Bmrked_post.create(req.params.post, (err, results) => {
//                 if (err) {
//                     return res.status(500).json({msg: "error", details: err})
//                 }
//                 console.log('added post to bookmarked post table')
//                 res.json(results)
//             })
//         }
//         // else, userCount +1
//         else {
//             bmrked_post[0].increment('userCount');
//             res.json(bmrked_post[0])
//         }
//     }).catch(err => {
//         res.status(500).json({msg: "error", details: err})
//     })
// })

// Delete a bookmark for logged user
router.delete('/', (req, res) => {
    const ntt_no = req.params.ntt_no;

    // delete from user_bmrked
    User_Bmrked.destroy(req.body, (err, results) => {
        if (err) {
            return res.status(500).json({msg: "error", details: err})
        }
    })
    Bmrked_post.findAll({
        where: { ntt_no: ntt_no }
    }).then(bmrked_post => {
        console.log(bmrked_post)
        // userCount -1
        bmrked_post[0].decrement('userCount')
        // if userCount == 0, delete from bmrked_posts
        if (bmrked_post[0] == 0) {
            Bmrked_post.destroy({where: { ntt_no: ntt_no }}, (err, results) => {
                if (err) {
                    return res.status(500).json({msg: "error", details: err})
                }
                console.log('deleted post to bookmarked ')
                res.json(results)
            })
        }
    }).catch(err => {
        res.status(500).json({msg: "error", details: err})
    })
})

// Delete a bookmarked post
router.delete('/:ntt_no', (req, res) => {
    const ntt_no = req.params.ntt_no;

    Bmrked_post.destroy({
        where: { ntt_no: ntt_no }
      }).then(() => {
        res.status(200).json( { msg: 'Deleted Successfully -> ntt_no = ' + ntt_no } );
      }).catch(err => {
        console.log("ERROR IS SHOWN HERE: " + err);
        res.status(500).json({msg: "error", details: err});
      });
  });

module.exports = router;