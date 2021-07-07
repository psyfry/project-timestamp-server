// server.js
// where your node app starts

// init project
const express = require('express');
let app = express();
const moment = require('moment');
moment().format();
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));


//First, handle check GET requests on the root /api path. Must do this before checking /api/:inputDate/ otherwise it will infinite loop. Always go in /parent -> /parent/child order
app.get("/api", (req, res, next) => {
  req.unix = Date.now();
  req.utc = moment().format("ddd, DD MMM YYYY HH:mm:ss").concat(" GMT");
  next();
},(req, res) =>{
  res.json({unix: req.unix, utc: req.utc});
});

app.get("/api/:inputDate/", (req, res, next) => {
  //UNIX epoch
  //Poor implementation to handle old FCC Test
  const unixReggie = /\d{9,}/;
  let input = req.params.inputDate;
  if(unixReggie.test(input)){
      req.unix = parseInt(input);
      //Convert input into UTC
      req.utc = moment(parseInt(input)).utc().format("ddd, DD MMM YYYY HH:mm:ss").concat(" GMT");
  } else{
    req.utc = new Date(input).toUTCString();
    req.unix = Date.parse(req.utc);
  }

  if((req.utc).match(/Invalid date/ig)){
    console.log("Invalid date error trigger: ")
    res.json({error: "Invalid Date"});
  }
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
let listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

