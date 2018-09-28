const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Status = require("../models/Status");
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login");

router.get("/", ensureLogin.ensureLoggedIn("/login"), (req, res, next) => {
  let user = req.user;
  let itemsOwned = [];
  let itemsKept = [];
  let StatusOwned = [];
  let StatusKept = [];
  User.findById({ _id: user._id })
    .then(user => {
      itemsOwned = user.itemsOwned;
      itemsKept = user.itemsKept;
/*     })
    .then(() => {
      itemsKept
        .forEach(item => Status.findById(item.statusID))
        .then(StatusK => {
          StatusKept = StatusK;
        });
    })
    .then(() => {
      itemsOwned
        .forEach(item => Status.findById(item.statusID))
        .then(StatusO => {
          StatusStatusOwnedKept = StatusO;
        });
    })
    .then(() => {*/
      console.log(itemsKept);
      res.render("../views/items/inventory", { itemsOwned, itemsKept,  StatusOwned, StatusKept});
    }) 
});

module.exports = router;
