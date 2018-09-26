"use strict";
var axios = require("axios");
const request = require("request");
require("dotenv").config({ path: ".private.env" });

const subscriptionKey = process.env.AZUREKEY;
const uriBase =
  "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/recognizeText?mode=Handwritten";
//&language=unk //"en"
//&detectOrientation=true

const getTextFromPhoto = function(imageUrl) {
  axios
    .post(uriBase, '{"url": ' + '"' + imageUrl + '"}', {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    })
    .then(response => {
      const url = response.headers["operation-location"];
      console.log(url);
      setTimeout(function() {
        axios
          .get(url, {
            headers: {
              "Content-Type": "application/json",
              "Ocp-Apim-Subscription-Key": subscriptionKey
            }
          })
          .then(response => {
            //Here we can do whatever we want with the response object
            console.log(JSON.stringify(response.data, null, 2));
            let resJSON = JSON.stringify(response.data, null, 2);
            let resObj = JSON.parse(resJSON);
            let resTextArrr = resObj.recognitionResult.lines;
            let resText = resTextArrr.map(e => e.text).join();
            console.log(resText);
            return resText;
          })
          .catch(err => {
            console.log(err);
          });
      }, 5000);
    })
    .catch(err => {
      console.log(err);
    });
};


module.exports = getTextFromPhoto;