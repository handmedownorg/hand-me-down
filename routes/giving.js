const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Status = require("../models/Status");
const User = require("../models/User");
const sendMail = require("../mail/sendMail");
const uploadCloud = require('../config/cloudinary.js');
const hbs = require("handlebars");
const fs = require("fs");
const ensureLogin = require('connect-ensure-login')
const getTextFromPhoto = require("../AzureOcrAPI/getTextFromPhoto");

router.get("/create", ensureLogin.ensureLoggedIn('/login'), (req, res, next) => {
  let tag = "SweetCharmanderClouds"; //temporary tag
  res.render("items/give");
});

router.post("/create", uploadCloud.single('tag-photo'), ensureLogin.ensureLoggedIn('/'), (req, res, next) => {
  //const tag = req.params.tag;
  let tag = "SweetCharmanderClouds";
  const { itemname, itemowner, itemkeeper } = req.body;
  const body = { itemname, itemowner, itemkeeper };
  const giver = req.user; //passport user

  const imgPath = req.file.url;
  const imgName = req.file.originalname;
  let textTag = getTextFromPhoto(imgPath);
  console.log(textTag);
  res.redirect("/items/inventory");
  return textTag
  .then(textTag =>{
    console.log(textTag);
    createNewOath(tag, body, giver)
    //.then necesary here to prevent the race condition
  })

});


function createNewOath(tag, body, giver) {

  let promises = [];
  let taker;
  let keeper;
  let newItem;
  promises.push(User.findOne({ username: body.itemowner }));
  promises.push(User.findOne({ username: body.itemkeeper }));

  Promise.all(promises)
    .then(promises => {
      taker = promises[0];
      keeper = promises[1];
      const newStatus = new Status({
        giverID: giver._id, //session
        takerID: taker._id,
        currentHolderID: keeper._id
      });

      newStatus.save()
        .then(status => {
          console.log(status);
          const newItem = new Item({
            name: body.itemname,
            tag,
            statusID: status._id
          });
          newItem
            .save()
            .then((newItem) => {
              const htmlGiving = require("../mail/templateGiving");
              return sendMail(keeper.email, "Do you outh to keep this?", htmlGiving(newItem.name, newItem.tag, newItem._id));
            })
            
        });
    });
}

module.exports = router;
