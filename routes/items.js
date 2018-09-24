const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Status = require("../models/Status");
const User = require("../models/User");
const sendMail = require("../mail/sendMail");
const hbs = require("handlebars");
const fs = require("fs");

router.get("/create", (req, res, next) => {
  let tag = "SweetCharmanderClouds"; //temporary tag
  res.render("items/give", { tag });
});

router.post("/create/:tag", (req, res, next) => {
  const tag = req.params.tag;
  const { itemname, itemowner, itemkeeper } = req.body;

  //console.log(itemkeeper, itemname, itemowner);
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

router.get("/take/:itemID", (req, res, next) => {
  const itemID = encodeURIComponent(req.params.itemID);
 // console.log(itemID);
  res.render("items/take", {itemID});
});

router.post("/taken/:itemID", (req, res, next) => {
  const itemID = encodeURIComponent(req.params.itemID);
  const newKeeper = req.user;
  let itemVar;
  
  Item.findById(itemID)
    .then(item => {
      console.log("---------------------------" + item);
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
      res.render("items/take", { itemVar, status });
    })
    .catch(err => {
      res.render("error", { message: "Keeper not found" });
    });

  res.render("items/taken");
});

router.get("/inventory", (req, res, next) => {
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
    newItem.save().then(() => {
      let html = `<p>Somebody give you ${newItem.name}</p>
      <p>Your confirmation code is: ${newStatus.tag}</p>
      <a href=http://localhost:3000/items/take/${
        newItem._id
      }>Click here to activate</a>`;
      sendMail(keeper.email, "Do you outh to keep this?", html);
    });
  });
}

module.exports = router;
