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

//this routes are requested after mail confirmation

router.get(
  "/take/:itemID",
  ensureLogin.ensureLoggedIn("/"),
  (req, res, next) => {
    const itemID = encodeURIComponent(req.params.itemID);
    Item.findById(itemID)
      .populate("statusID")
      .then(item => {
        const user = req.user;
        //console.log("item + user: " + item, user)
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
    //console.log("This is the image path " + imgPath);
    let tagFromAPI;

    getTextFromPhoto(imgPath)
      .then(url => resolveAfterWait(5000, url))
      .then(textTag => {
        console.log("The TAG goes through create /POST " + textTag);
        tagFromAPI = textTag;
        Item.findById(itemID)
          .then(item => {
            if (item.tag == tagFromAPI) {
              console.log(
                "After verification the tags match => IT'S THE SAME BOOK"
              );
            } else {
              console.log(
                "After verification the don't tags match => IT'S NOT THE SAME BOOK"
              );
            }
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
  }
);

module.exports = router;
