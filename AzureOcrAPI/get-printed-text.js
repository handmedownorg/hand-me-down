// "use strict";
const request = require("request");

const subscriptionKey = process.env.AZUREKEY;

const uriBase =
  "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/recognizeText";
//"https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/ocr";

//const imageUrl ="https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Atomist_quote_from_Democritus.png/338px-Atomist_quote_from_Democritus.png";
const imageUrl =
  "https://res.cloudinary.com/handmedown/image/upload/v1537867904/handmedowntags/tag4.jpg";

// Request parameters.
// const params = {
//   //mode: "Handwritten",
//   language: "unk", //"en"
//   detectOrientation: "true"
// };
var params = {
  "mode": "Handwritten",
};
console.log( uriBase + "?" + params)
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
  // if (error) {
  //   console.log("Error: ", error);
  //   return;
  // }
  // let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
  // console.log("JSON Response\n");
  // console.log(jsonResponse);
  // request.get()
})
.then((body, textStatus, jqXHR) => {
  let jsonResponse = JSON.stringify(JSON.parse(body), null, "  ");
  console.log("JSON Response\n");
  console.log(jsonResponse);
  let newHeader = jqXHR.getResponseHeader("Operation-Location");
  options
  request.get()
})
