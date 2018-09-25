"use strict";
var axios = require("axios");
const request = require("request");

const subscriptionKey = "eaaddf9ce76e44d3a26929c3dc161266";
//const subscriptionKey = process.env.AZUREKEY;

const uriBase =
  "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/recognizeText";
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

const urlAPI = axios.create({
  baseURL: uriBase
});

var config = {
  uri: uriBase,
  qs: params,
  body: '{"url": ' + '"' + imageUrl + '"}',
  headers: {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": subscriptionKey
  }
};

axios.post(config, (error, response, body) => {
    if (error) {
      console.log("Error: ", error);
      return;
    }

    console.log("Azure API POST");
  })
  .then(response => {
    //Here we can do whatever we want with the response object
  })
  .catch(err => {
    //Here we catch the error and display it
  });

axios.get(config, (error, response, body) => {
    if (error) {
      console.log("Error: ", error);
      return;
    }
    let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
    console.log("Azure API GET");
    console.log("JSON Response\n");
    console.log(jsonResponse);
  })
  .then(response => {
    //Here we can do whatever we want with the response object
  })
  .catch(err => {
    //Here we catch the error and display it
  });
