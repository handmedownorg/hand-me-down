const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Status = require("../models/Status");
const User = require("../models/User");
const sendMail = require("../mail/sendMail");
const uploadCloud = require("../config/cloudinary.js");
const ensureLogin = require("connect-ensure-login");
const { getTextFromPhoto } = require("../AzureOcrAPI/getTextFromPhoto");
const { resolveAfterWait } = require("../AzureOcrAPI/getTextFromPhoto");
const htmlNotification = require("../mail/templateNotification");
let ownerID;
let statusVar;

router.get(
  "/take/:itemID",
  ensureLogin.ensureLoggedIn("/"),
  (req, res, next) => {
    const itemID = encodeURIComponent(req.params.itemID);
    Item.findById(itemID)
      .populate("statusID")
      .then(item => {
        const user = req.user;
        res.render("items/take", { item, user });
      })
      .catch(e => console.log(e));
  }
);

router.post(
  "/taken/:itemID",
  uploadCloud.single("tag-photo"),
  ensureLogin.ensureLoggedIn("/"),
  (req, res, next) => {
    const itemID = encodeURIComponent(req.params.itemID);
    const newKeeper = req.user;
    const imgPath = req.file.url;
    let tagFromAPI;
    let itemVar;
    let isowner;

    getTextFromPhoto(imgPath)
      .then(url => resolveAfterWait(5000, url))
      .then(textTag => {
        console.log("The TAG goes through create /POST " + textTag);
        tagFromAPI = textTag;

        Item.findById(itemID)
          .then(item => {
            itemVar = item;
            if (item.tag == tagFromAPI) {
              //if IT'S the same tag
              console.log(
                "After verification the tags match => IT'S THE SAME BOOK"
              );
              return Status.findById(item.statusID);
            } else {
              //if IT'S NOT the same tag
              console.log(
                "After verification the don't tags match => IT'S NOT THE SAME BOOK"
              );
              res.render("items/wrong");
              return undefined;
            }
          })
          .then(status => {
            console.log("The keeper was " + status.currentHolderID);
            statusVar = status;
            
            User.findByIdAndUpdate(status.currentHolderID, { $pull: { itemsKept: itemVar } }, {new:true})
            .then(user => console.log("resuelve pull keeper" + status.currentHolderID))
            return Status.findByIdAndUpdate(
              { _id: status._id },
              { currentHolderID: newKeeper._id }
            );
          })
          .then(status => {
            console.log("Now the keeper is " + status.currentHolderID);
            console.log(status.takerID[0]);
            if (status.currentHolderID == status.takerID[0]) {
              console.log("Congratulations you received your item");
              isowner = "This is yours!";
            } else {
              console.log(
                "This item doesn't belong to you, please give it to its owner"
                );
              isowner = "You are a keeper";
            }
            
            User.findByIdAndUpdate(req.user._id, { $push: { itemsKept: itemVar } }, {new:true})
            .then(user => console.log("resuelve push keeper" + status.currentHolderID));
            console.log(status.takerID)
            User.findById({_id: status.takerID[0]})
            .then(owner => {
              sendMail(owner.email, "Your item " + itemVar.name + " is changing hands!", htmlNotification(itemVar.name, itemVar.tag))
            })
            res.render("items/confirmation");
          })
          .catch(err => {
            res.render("error", { message: "Keeper not found" });
          });
      });
  }
);

router.get("/receive", (req, res, next) => {
  res.redirect("/inventory");
});

module.exports = router;
