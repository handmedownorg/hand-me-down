const htmlGiving =  (name, tag, id) => `<!DOCTYPE html>
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

<h2>A bird told us somebody is handing something down to you.</h2>
<p> Is it cookies? Is it a book?</p>
<p>Nope. It is: </p>
<div>${name}</div>
<p>Take the oath that, eventualy, it will get back to his owner.</p>
<p>The secret tag is ${tag}</p> 

<a href="${process.env.URL}/items/take/${id}"><button>TAKE THE OATH</button></a>
  
</body>
</html>`

module.exports = html;