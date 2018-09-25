"use strict";
var axios = require("axios");
const request = require("request");
require('dotenv').config({path: '.private.env'});

const subscriptionKey = process.env.AZUREKEY;

const uriBase =
  "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/recognizeText?mode=Handwritten";
//"https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr";

//const imageUrl ="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png";
const imageUrl =
  "https://res.cloudinary.com/handmedown/image/upload/v1537867904/handmedowntags/tag4.jpg";

// Request parameters.
const params = {
  mode: "Handwritten"
  //language: "unk", //"en"
  //detectOrientation: "true"
};

/* const urlAPI = axios.create({
  baseURL: uriBase
}); */

var config = {
  uri: uriBase,
  qs: params,
  body: '{"url": ' + '"' + imageUrl + '"}',
  headers: {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": subscriptionKey
  }
};


axios.post(uriBase, config.body, config.headers)
  .then(response => {
    console.log(response)
    // axios.get(config, (error, response, body) => {
    //   let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
    //   console.log("Azure API GET");
    //   console.log("JSON Response\n");
    //   console.log(jsonResponse);
    // })
    // .then(response => {
    //   //Here we can do whatever we want with the response object
    // })  
    //Here we can do whatever we want with the response object
  })
  .catch(err => {
    console.log(err)
    //Here we catch the error and display it
  });

