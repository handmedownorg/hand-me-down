const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Status = require("../models/Status");
const User = require("../models/User");
const sendMail = require("../mail/sendMail");

router.get("/create", (req, res, next) => {
  let tag = "SweetCharmanderClouds"; //temporary tag
  res.render("items/create", { tag });
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
    //console.log("The taker is " + t);
    k = promises[1];
    //console.log("The keeper is " + k);
    createNewOath(tag, itemname, giver, k, t);
    res.redirect("/items/inventory");
  });
});

router.get("/receive", (req, res, next) => {
  res.render("items/receive");
});

router.get("/inventory", (req, res, next) => {
  res.render("items/inventory");
});

function createNewOath(tag, itemname, giver, keeper, taker) {
  console.log(taker)
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
