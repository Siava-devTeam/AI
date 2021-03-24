// Package Import
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var user = require("./routes/user.route");
var publicCTRL = require("./controllers/public.controller");
var path = require('path');

// app
const app = express();

//app.use()
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

//Api(s)
app.use("/api/v1/user", user);
app.get("/profileinfo/:token", publicCTRL.htmlTokenHandler);

//Static Route
var frontEndPath = path.join(__dirname,'../','src','public');
app.use("/", express.static(frontEndPath));


//404 route
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

//ERROR Handler
app.use((error, req, res,next) => {
    
    console.log(error);

    if (!error.statusCode) error.statusCode = 500;

    return res
      .status(error.statusCode)
      .json({ error: error.toString() });
  });


module.exports = app;