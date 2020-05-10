const express = require('express');
const path = require('path');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/:image', function(req, res, next) {
  const options = {
    root: path.join(__dirname, '../public')
  }
  res.sendFile('/images/backward.png', options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent');
    }
  })
});



module.exports = router;
