const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Item = require("../models/Item");
const Status = require("../models/Status");

const sendMail = require("../mail/giveMail");

router.post("/sendmail/:itemId", (req, res, next) => {

  req.params.itemId

  Item.findById(itemId)
    .then(item => {
      let statusID = item.statusID;
      let itemName = item.name;
      Status.findById(statusID);
    })
    .then(itemStatus => {
      let keeperID = itemStatus.currentHolderID;
      let emailKeeper = keeperID.email;

      let html = `<p>Somebody give you ${itemName}</p>
      <p>Your confirmation code is: ${code}</p>
      <a href=http://localhost:3000/take/${tag}>Click here to activate</a>`;

      sendMail(emailKeeper, "Do you outh to keep this?", html);
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    });
});

module.exports = router;
