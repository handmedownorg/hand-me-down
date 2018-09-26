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

router.post("/create/:tag", uploadCloud.single('tag-photo'), ensureLogin.ensureLoggedIn('/'), (req, res, next) => {
  const tag = req.params.tag;
  const { itemname, itemowner, itemkeeper } = req.body;
  const body = { itemname, itemowner, itemkeeper };
  const giver = req.user; //passport user
  
  const imgPath = req.file.url;
  const imgName = req.file.originalname;

  createNewOath(tag, body, giver)
  //.then necesary here to prevent the race condition
    res.redirect("/items/inventory")



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
      const htmlNotification = require('../mail/templateNotification')
      //sendMail(taker.email, "Your item " + item.name + " is changing hands!", htmlNotification(item.name, item.tag))
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


function createNewOath(tag, body, giver) {

  let promises = [];
  promises.push(User.findOne({ username: body.itemowner }));
  promises.push(User.findOne({ username: body.itemkeeper }));

  Promise.all(promises)
    .then(promises => {
      taker = promises[0];
      keeper = promises[1];
      const newStatus = new Status({
        giverID: giver._id, //session
        takerID: taker._id,
        currentHolderID: keeper._id
      });

      newStatus.save()
        .then(status => {
          const newItem = new Item({
            name: body.itemname,
            tag,
            statusID: status._id
          });
          newItem
            .save()
            .then((newItem) => {
              const htmlGiving = require("../mail/templateGiving");
              return sendMail(keeper.email, "Do you outh to keep this?", htmlGiving(newItem.name, newItem.tag, newItem._id));
            })
        });
    });
}

module.exports = router;
