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
      .then(() => {
        let html = `<p>Somebody give you ${newItem.name}</p>
      <p>Your confirmation code is: ${newStatus.tag}</p>
      <a href=http://localhost:3000/take/${
        newStatus._id
      }>Click here to activate</a>`;
        sendMail(keeper.email, "Do you outh to keep this?", html);
      })
      .catch(err => {
        res.render("auth/signup", { message: "Something went wrong" });
      });
  });
}

module.exports = router;
