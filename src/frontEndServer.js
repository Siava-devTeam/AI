// Package Import
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var config = require('./config');
var morgan;

// app
const app = express();

//app.use()
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// nodeEnvironment
var nodeEnvironment = typeof(process.env.NODE_ENV)!= undefined ? process.env.NODE_ENV : 'development';
nodeEnvironment = (['development','production'].indexOf(nodeEnvironment))>-1 ? nodeEnvironment : 'development';
if (nodeEnvironment=='development'){
    morgan = require('morgan');
    app.use(morgan("dev"))
}

//Static Route
app.use("/", express.static("./src/public"));
//404 route
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));


module.exports = app;