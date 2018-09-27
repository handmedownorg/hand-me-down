const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Status = require("../models/Status");
const User = require("../models/User");
const ensureLogin = require('connect-ensure-login')

router.get('/', ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {

  let user = req.user;
  User.findById({ _id: user._id })
  .then(user => {
      console.log(user)
      const itemsOwned = user.itemsOwned;
      const itemsKept = user.itemsKept;
      itemsKept.forEach(item => {
        item.populate("statusID");
      });
      res.render('../views/items/inventory', {itemsOwned, itemsKept})
    })
})

module.exports = router;
