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
            
            User.findByIdAndUpdate(status.currentHolderID, { $pull: { itemsKept: itemVar } }, {new:true})
            .then(user => console.log("resuelve pull keeper" + status.currentHolderID))
            return Status.findByIdAndUpdate(
              { _id: status._id },
              { currentHolderID: newKeeper._id }
            );
          })
          .then(status => {
            console.log("Now the keeper is " + status.currentHolderID);
            itemVar.name = "otra cosa";
            //check if the new keeper is the owner (final taker)
            //-----------------------------------------------------
            if (status.currentHolderID == status.takerID) {
              console.log("Congratulations you received your item");
              isowner = "This is yours!";
            } else {
              console.log(
                "This item doesn't belong to you, please give it to its owner"
              );
              isowner = "You are a keeper";
            }
            User.update(
              { _id: status.currentHolderID },
              { $push: { itemsKept: itemVar } }
            ).then(() => console.log("exito push keeper"));
            res.render("items/confirmation", {isowner});
            sendMail(
              taker.email,
              "Your item " + item.name + " is changing hands!",
              htmlNotification(item.name, item.tag)
            );
            //sendMail(taker.email,`${keeper.username} is now keeping your ${newItem.name}`, htmlGiving(newItem.name, newItem.tag, newItem._id));
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
