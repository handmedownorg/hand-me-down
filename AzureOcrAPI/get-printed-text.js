"use strict";

const request = require("request");

// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = "eaaddf9ce76e44d3a26929c3dc161266";
//const subscriptionKey = process.env.AZUREKEY;

// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".
const uriBase =
  "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr";

const imageUrl ="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png";
//const imageUrl = "https://www.dropbox.com/s/yrb52ilco4xcyu7/tag.jpg?dl=0";

// Request parameters.
const params = {
  language: "unk",
  detectOrientation: "true"
};

const options = {
  uri: uriBase,
  qs: params,
  body: '{"url": ' + '"' + imageUrl + '"}',
  headers: {
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": subscriptionKey
  }
};

request.post(options, (error, response, body) => {
  if (error) {
    console.log("Error: ", error);
    return;
  }
  let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
  console.log("JSON Response\n");
  console.log(jsonResponse);
});
