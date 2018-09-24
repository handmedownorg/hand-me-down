const express = require('express');
const router  = express.Router();
const Item = require('../models/Item');
const Status = require('../models/Status')
const User = require('../models/User')

router.get('/create', (req, res, next) => {
  let tag = "SweetCharmanderClouds" //temporary tag
  res.render('items/create', {tag});
});

router.post('/create/:tag', (req, res, next) => {
  const tag = req.params.tag;
  const {itemname, itemowner, itemkeeper} = req.body;
  console.log(itemkeeper, itemowner, itemname);

  const giver = req.user._id //passport user
  const keeper = User.findOne({username: itemkeeper})._id
  const taker = User.findOne({username: itemowner})._id
  console.log(giver, taker, keeper);

  if (Item.findOne({tag}) !== null) {

  } else {
    createNewOath(tag, itemname, giver, keeper, taker);
    res.redirect('/items/inventory')
  }

  
})

router.get('/receive', (req, res, next) => {
  res.render('items/receive');
});

router.get('/inventory', (req, res, next) => {
  res.render('items/inventory');
});


function createNewOath(tag, itemname, giver, keeper, taker) {
 
  const newStatus = new Status({
    giverID: giver,//session
    takerID: taker,
    currentHolderID: keeper
  })
  newStatus.save()
  .then(status => {
    const newItem = new Item({
      name: itemname,
      tag,
      statusID: status._id
    })
    newItem.save();
  })
}

module.exports = router;