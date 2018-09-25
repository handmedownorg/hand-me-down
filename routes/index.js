const express = require('express');
const router  = express.Router();



/* Home page and info */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/about', (req, res, next) => {
  res.render('info/about')
})

module.exports = router;

