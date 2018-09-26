require('dotenv').config({path: '.private.env'});
//var subscriptionKey = process.env.AZUREKEY;

function processImage() {

  var subscriptionKey = "eaaddf9ce76e44d3a26929c3dc161266";
  var uriBase =
    "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/recognizeText";

  // Request parameter.
  var params = {
    "mode": "Handwritten",
  };

  // Display the image.
  var sourceImageUrl = document.getElementById("inputImage").value;
  document.querySelector("#sourceImage").src = sourceImageUrl;
  $.ajax({
    url: uriBase + "?" + $.param(params),

    // Request headers.
    beforeSend: function (jqXHR) {
      jqXHR.setRequestHeader("Content-Type", "application/json");
      jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },

    type: "POST",

    // Request body.
    data: '{"url": ' + '"' + sourceImageUrl + '"}',
  })

    .done(function (data, textStatus, jqXHR) {
      // Show progress.
      $("#responseTextArea").val("Handwritten text submitted. " +
        "Waiting 10 seconds to retrieve the recognized text.");

      setTimeout(function () {

        var operationLocation = jqXHR.getResponseHeader("Operation-Location");


        // Make the second REST API call and get the response.
        $.ajax({
          url: operationLocation,

          // Request headers.
          beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Content-Type", "application/json");
            jqXHR.setRequestHeader(
              "Ocp-Apim-Subscription-Key", subscriptionKey);
          },

          type: "GET",
        })

          .done(function (data) {
            // Show formatted JSON on webpage.
            let resJSON = JSON.stringify(data, null, 2);
            
            let resObj = JSON.parse(resJSON);
        
            let resTextArrr = resObj.recognitionResult.lines;
            let resText = resTextArrr.map(e=>e.text).join();
            console.log(resText);

            $("#responseTextArea").val(resText);
          })

          .fail(function (jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " :
              errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" :
              (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message :
                jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
          });
      }, 5000);
    })

    .fail(function (jqXHR, textStatus, errorThrown) {
      // Put the JSON description into the text area.
      $("#responseTextArea").val(JSON.stringify(jqXHR, null, 2));

      // Display error message.
      var errorString = (errorThrown === "") ? "Error. " :
        errorThrown + " (" + jqXHR.status + "): ";
      errorString += (jqXHR.responseText === "") ? "" :
        (jQuery.parseJSON(jqXHR.responseText).message) ?
          jQuery.parseJSON(jqXHR.responseText).message :
          jQuery.parseJSON(jqXHR.responseText).error.message;
      alert(errorString);
    });
};