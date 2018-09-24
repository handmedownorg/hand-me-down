const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Status = require("../models/Status");
const User = require("../models/User");

router.get("/create", (req, res, next) => {
  let tag = "SweetCharmanderClouds"; //temporary tag
  res.render("items/create", { tag });
});

router.post("/create/:tag", (req, res, next) => {
  const tag = req.params.tag;
  const { itemname, itemowner, itemkeeper } = req.body;
  console.log(itemkeeper, itemowner, itemname);
  let taker, keeper;
  const giver = req.user._id; //passport user
  keeper = User.findOne({ username: itemkeeper })
    .then(keeper => {
      console.log(keeper);
      taker = User.findOne({ username: itemowner });
      return taker;
    })
    .then(taker => {
      console.log(taker);
      Item.findOne({ tag });
    })
    .then((uniqueTag) => {
        createNewOath(tag, itemname, giver._id, keeper._id, taker);
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
  console.log("CreateNewOath function" + tag, itemname, giver, keeper, taker);
  const newStatus = new Status({
    giverID: giver, //session
    takerID: taker,
    currentHolderID: keeper
  });
  newStatus.save().then(status => {
    const newItem = new Item({
      name: itemname,
      tag,
      statusID: status._id
    });
    newItem.save();
  });
}

module.exports = router;
