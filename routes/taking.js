express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Status = require("../models/Status");
const User = require("../models/User");
const sendMail = require("../mail/sendMail");
const uploadCloud = require('../config/cloudinary.js');
const hbs = require("handlebars");
const fs = require("fs");
const ensureLogin = require('connect-ensure-login')

//this routes are requested after mail confirmation

router.get("/take/:itemID", ensureLogin.ensureLoggedIn('/'), (req, res, next) => {

  const itemID = encodeURIComponent(req.params.itemID);
  Item.findById(itemID).
    populate("statusID")
    .then(item => {
      const user = req.user;
      console.log("item + user: " + item, user)
      res.render("items/take", { item, user })
    })
    .catch(e => console.log(e))
});

// TO IMPLEMENT BELOW:
/* sendMail(taker.email, "Your item " + item.name + " is changing hands!", htmlNotification(item.name, item.tag))
const htmlNotification = require('../mail/templateNotification')
*/

router.post("/taken/:itemID", ensureLogin.ensureLoggedIn('/'), (req, res, next) => {
  const itemID = encodeURIComponent(req.params.itemID);
  const newKeeper = req.user;
  let itemVar;

  //change the item status
  //the array of objects of the new keeper and the old keeper is updated

  Item.findById(itemID)
    .then(item => {
      itemVar = item;
      User.update({ _id: newKeeper._id }, { $push: { itemsKept: item } }).then(()=>console.log("exito"))
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


module.exports = router;