const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Status = require("../models/Status");
const User = require("../models/User");
const sendMail = require("../mail/sendMail");
const uploadCloud = require('../config/cloudinary.js');
const hbs = require("handlebars");
const fs = require("fs");
const ensureLogin = require('connect-ensure-login')

router.get("/create", ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  let tag = "SweetCharmanderClouds"; //temporary tag
  res.render("items/give", { tag });
});

router.post("/create/:tag", ensureLogin.ensureLoggedIn('/'), (req, res, next) => {
  const tag = req.params.tag;
  const { itemname, itemowner, itemkeeper } = req.body;

  let promises = [];
  const giver = req.user; //passport user
  const taker = User.findOne({ username: itemowner });
  const keeper = User.findOne({ username: itemkeeper });
  promises.push(taker);
  promises.push(keeper);
  Promise.all(promises).then(promises => {
    t = promises[0];
    k = promises[1];
    createNewOath(tag, itemname, giver, k, t);
    res.redirect("/items/inventory");
  });
});

router.get("/take/:itemID", ensureLogin.ensureLoggedIn('/'), (req, res, next) => {
  const itemID = encodeURIComponent(req.params.itemID);
  let item;
  Item.findById(itemID).
    populate("statusID")
    .then(itemObj => {
      item = itemObj
      //console.log("item: --->" + item.statusID[0].takerID);
      return User.findById(item.statusID[0].takerID)
    })
    .then(user => {
      //console.log(item, user)
      res.render("items/take", { item, user })
    })
    .catch(e => console.log(e))
});

router.post("/taken/:itemID", ensureLogin.ensureLoggedIn('/'), (req, res, next) => {  //refactor this using populate
  const itemID = encodeURIComponent(req.params.itemID);
  const newKeeper = req.user;
  let itemVar;

  Item.findById(itemID)
    .then(item => {
      itemVar = item;
      return Status.findById(item.statusID);
    })
    .then(status => {
      console.log("The keeper was " + status.currentHolderID);
      return Status.findByIdAndUpdate(
        { _id: status._id },
        { currentHolderID: newKeeper._id }
      );
    })
    .then(status => {
      console.log("Now the keeper is " + status.currentHolderID);
      res.render("items/confirmation");
    })
    .catch(err => {
      res.render("error", { message: "Keeper not found" });
    });
});

router.get("/inventory", ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  res.render("items/inventory");
});

function createNewOath(tag, itemname, giver, keeper, taker) {
  const newStatus = new Status({
    giverID: giver._id, //session
    takerID: taker._id,
    currentHolderID: keeper._id
  });
  newStatus.save().then(status => {
    const newItem = new Item({
      name: itemname,
      tag,
      statusID: status._id
    });
    newItem
      .save()
      .then((newItem) => {
        const html = require("../mail/template");
        sendMail(keeper.email, "Do you outh to keep this?", html(newItem.name, newItem.tag, newItem._id));
      })
      .catch(err => {
        console.log(err)
      });
  });
}

module.exports = router;
