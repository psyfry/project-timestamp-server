// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var moment = require('moment');
moment().format();
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

//Handle /api/:input GET requests
app.route("/api/:inputDate/").get((req, res, next) => {
  var input= req.params.inputDate;
  let dateReggie = /\d{4}\-\d{2}\-\d{2}/
  switch(dateReggie.test(input)){
    case true:
      req.unix = Date.parse(input);
      req.utc = new Date(input).toUTCString();
      break;
    case false:
      req.unix = parseInt(input);
      req.utc = moment.unix(parseInt(input)).utc();
  }
  console.log(input)
  console.log(`req.unix= ${req.unix} | req.utc = ${req.utc}`);
  next();
}, (req, res) => {
  res.json({unix: req.unix,utc: req.utc});
}); 

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
/*
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
*/


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

