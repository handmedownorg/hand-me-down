function processImage() {
  
  var subscriptionKey = "eaaddf9ce76e44d3a26929c3dc161266";

  var uriBase =
    "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/recognizeText";

  var params = {
    mode: "Handwritten"
  };

  var sourceImageUrl = document.getElementById("inputImage").value;
  document.querySelector("#sourceImage").src = sourceImageUrl;

  $.ajax({
    url: uriBase + "?" + $.param(params),

    // Request headers.
    beforeSend: function(jqXHR) {
      jqXHR.setRequestHeader("Content-Type", "application/json");
      jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },

    type: "POST",

    // Request body.
    data: '{"url": ' + '"' + sourceImageUrl + '"}'
  })

    .done(function(data, textStatus, jqXHR) {
      // Show progress.
      $("#responseTextArea").val(
        "Handwritten text submitted. " +
          "Waiting 10 seconds to retrieve the recognized text."
      );

      // Note: The response may not be immediately available. Handwriting
      // recognition is an asynchronous operation that can take a variable
      // amount of time depending on the length of the text you want to
      // recognize. You may need to wait or retry the GET operation.
      //
      // Wait ten seconds before making the second REST API call.
      setTimeout(function() {
        // "Operation-Location" in the response contains the URI
        // to retrieve the recognized text.
        var operationLocation = jqXHR.getResponseHeader("Operation-Location");

        // Make the second REST API call and get the response.
        $.ajax({
          url: operationLocation,

          // Request headers.
          beforeSend: function(jqXHR) {
            jqXHR.setRequestHeader("Content-Type", "application/json");
            jqXHR.setRequestHeader(
              "Ocp-Apim-Subscription-Key",
              subscriptionKey
            );
          },

          type: "GET"
        })

          .done(function(data) {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
          })

          .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString =
              errorThrown === ""
                ? "Error. "
                : errorThrown + " (" + jqXHR.status + "): ";
            errorString +=
              jqXHR.responseText === ""
                ? ""
                : jQuery.parseJSON(jqXHR.responseText).message
                  ? jQuery.parseJSON(jqXHR.responseText).message
                  : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
          });
      }, 10000);
    })

    .fail(function(jqXHR, textStatus, errorThrown) {
      // Put the JSON description into the text area.
      $("#responseTextArea").val(JSON.stringify(jqXHR, null, 2));

      // Display error message.
      var errorString =
        errorThrown === ""
          ? "Error. "
          : errorThrown + " (" + jqXHR.status + "): ";
      errorString +=
        jqXHR.responseText === ""
          ? ""
          : jQuery.parseJSON(jqXHR.responseText).message
            ? jQuery.parseJSON(jqXHR.responseText).message
            : jQuery.parseJSON(jqXHR.responseText).error.message;
      alert(errorString);
    });
}
