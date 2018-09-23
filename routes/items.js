const express = require('express');
const router  = express.Router();


router.get('/create', (req, res, next) => {
  res.render('items/create');
});

router.get('/receive', (req, res, next) => {
  res.render('items/receive');
});

router.get('/inventory', (req, res, next) => {
  res.render('items/inventory');
});

module.exports = router;
