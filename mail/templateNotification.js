const htmlNotification =  (name, tag) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Hand-me-down notification</title>
</head>
<body>

<h1>HAND ME DOWN LOGO</h1>

<h1>HEY YOU!</h1>

<h2>A bird told us somebody is passing around something that you own.</h2>
<p>More specifically: </p>
<div>${name}</div>
<p>We just wanted to notify you. Should you say something about it, you can use this tag to refer the object:</p>
<p>${tag}</p> 
</body>
</html>`

module.exports = htmlNotification;