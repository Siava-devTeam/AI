// Package Import
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
// var http = require('http');
var morgan = require('morgan');

// app
const app = express();

//app.use()
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan("dev"))

//Static Route
app.use("/", express.static("./public"));
//404 route
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));


module.exports = app;