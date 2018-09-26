"use strict";
var axios = require("axios");
const request = require("request");
require("dotenv").config({ path: ".private.env" });

const subscriptionKey = process.env.AZUREKEY;
const uriBase =
  "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/recognizeText?mode=Handwritten";
//&language=unk //"en"
//&detectOrientation=true

const getTextFromPhoto = imageUrl => {
  let resText = "SweetCharmanderClouds";
  axios
    .post(uriBase, '{"url": ' + '"' + imageUrl + '"}', {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
      }
    })
    .then(response => {
      const url = response.headers["operation-location"];
      console.log("Requesting API at " + url);
      let ms = 5000;
      function resolveAfterWait() {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            axios
              .get(url, {
                headers: {
                  "Content-Type": "application/json",
                  "Ocp-Apim-Subscription-Key": subscriptionKey
                }
              })
              .then(response => {
                let resJSON = JSON.stringify(response.data, null, 2);
                let resObj = JSON.parse(resJSON);
                let resTextArrr = resObj.recognitionResult.lines;
                resText = resTextArrr.map(e => e.text).join();
                console.log("The TAG for this object is " + resText);
                resolve(resText);
              })
              .catch(err => {
                console.log(err);
                reject;
              });
          }, ms);
        });
      }

      async function asyncCall() {
        console.log("Calling API");
        var result = await resolveAfterWait();
        console.log("The response is: " + result);
      }
      asyncCall();
    });
};

module.exports = getTextFromPhoto;
