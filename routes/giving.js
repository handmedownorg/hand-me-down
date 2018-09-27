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
const htmlGiving = require("../mail/templateGiving");

router.get(
  "/create",
  ensureLogin.ensureLoggedIn("/login"),
  (req, res, next) => {
    res.render("items/give");
  }
);

router.post(
  "/create",
  uploadCloud.single("tag-photo"),
  ensureLogin.ensureLoggedIn("/"),
  (req, res, next) => {
    const { itemname, itemowner, itemkeeper } = req.body;
    const body = { itemname, itemowner, itemkeeper };
    const giver = req.user; //passport user

    const imgPath = req.file.url;
    const imgName = req.file.originalname;
    res.redirect("/inventory");

    getTextFromPhoto(imgPath)
      .then(url => resolveAfterWait(10000, url))
      .then(textTag => {
        console.log("The TAG goes through create /POST " + textTag);
        Item.findOne({ textTag }).then(item => {
          if (item === null) {
            createNewOath(textTag, body, giver);
          } else {
            User.findOne({ username: itemkeeper }).then(keeper => {
              sendMail(
                keeper.email,
                "Do you outh to keep this?",
                htmlGiving(item.name, item.tag, item._id)
              );
            });
          }
        });
      });
  }
);

function createNewOath(tag, body, giver) {
  let promises = [];
  let taker;
  let keeper;
  let newItem;
  promises.push(User.findOne({ username: body.itemowner }));
  promises.push(User.findOne({ username: body.itemkeeper }));

  Promise.all(promises).then(promises => {
    taker = promises[0];
    keeper = promises[1];
    const newStatus = new Status({
      giverID: giver._id, //session
      takerID: taker._id,
      currentHolderID: giver._id
    });

    newStatus.save().then(status => {
      //console.log(status);
      const newItem = new Item({
        name: body.itemname,
        tag,
        statusID: status._id
      });
      newItem.save().then(newItem => {
        console.log("entra")
        
        User.findByIdAndUpdate(giver._id , { $push: { itemsKept: newItem } }, {new:true})
        .then(console.log)
        User.findByIdAndUpdate(taker._id, { $push: { itemsOwned: newItem } }, {new:true})
        .then(console.log)
        sendMail(
          keeper.email,
          "Do you outh to keep this?",
          htmlGiving(newItem.name, newItem.tag, newItem._id)
        );
      });
    });
  });
}

module.exports = router;
