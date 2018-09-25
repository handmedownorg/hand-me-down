// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();


//var image = 'image.jpg';

/* vision.detectText('image.jpg', function(err, text, apiResponse) {
  // text = ['This was text found in the image']
}); */

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Bucket where the file resides, e.g. my-bucket';
const fileName = './images/tag.jpg';

// Performs text detection on the gcs file
client
  .textDetection(`gs://${bucketName}/${fileName}`)
  .then(results => {
    const detections = results[0].textAnnotations;
    console.log('Text:');
    detections.forEach(text => console.log(text));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });




ENVIAR COMENTARIOS
Text detection samples
Text Detection performs Optical Character Recognition. It detects and extracts text within an image with support for a broad range of languages. It also features automatic language identification.

Detecting text in a local image
PROTOCOLC#GOJAVANODE.JSPHPPYTHONRUBY
Before trying this sample, follow the Node.js setup instructions in the Vision API Quickstart Using Client Libraries . For more information, see the Vision API Node.js API reference documentation .

VIEW ON GITHUB FEEDBACK
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
// const fileName = 'Local image file, e.g. /path/to/image.png';

// Performs text detection on the local file
client
  .textDetection(fileName)
  .then(results => {
    const detections = results[0].textAnnotations;
    console.log('Text:');
    detections.forEach(text => console.log(text));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
Detecting text in a remote image
For your convenience, the Vision API can perform Text detection directly on an image file located in Google Cloud Storage or on the Web without the need to send the contents of the image file in the body of your request.

PROTOCOLC#GOJAVANODE.JSPHPPYTHONRUBY
Before trying this sample, follow the Node.js setup instructions in the Vision API Quickstart Using Client Libraries . For more information, see the Vision API Node.js API reference documentation .

VIEW ON GITHUB FEEDBACK
// Imports the Google Cloud client libraries
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// const bucketName = 'Bucket where the file resides, e.g. my-bucket';
// const fileName = 'Path to file within bucket, e.g. path/to/image.png';

// Performs text detection on the gcs file
client
  .textDetection(`gs://${bucketName}/${fileName}`)
  .then(results => {
    const detections = results[0].textAnnotations;
    console.log('Text:');
    detections.forEach(text => console.log(text));
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
//Detecting Handwriting
//The Vision API can also detect handwriting in an image. To detect handwriting in an image, specify the TEXT_DETECTION feature and include a language hint of "en-t-i0-handwrit". The language hint tells the Vision API to use the handwriting model when detecting text in an image.

{
  "requests": [
    {
      "image": {
        "source": {
          "imageUri": "image-url"
        }
      },
      "features": [
        {
          "type": "TEXT_DETECTION"
        }
      ],
      "imageContext": {
        "languageHints": ["en-t-i0-handwrit"]
      }
    }
  ]
}