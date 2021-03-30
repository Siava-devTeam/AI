// Package Import
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var user = require("./routes/user.route");
var publicCTRL = require("./controllers/public.controller");
var path = require('path');
var config = require('../config');
var morgan;

// app
const app = express();

//app.use()
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// nodeEnvironment
var nodeEnvironment = typeof(process.env.NODE_ENV)!= undefined ? process.env.NODE_ENV : 'development';
nodeEnvironment = (['development','production'].indexOf(nodeEnvironment))>-1 ? nodeEnvironment : 'development';
if (nodeEnvironment=='development'){
    morgan = require('morgan');
    app.use(morgan("dev"))
}

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