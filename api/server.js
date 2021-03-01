// Package Import
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path= require('path');

// app
const app = express();

//app.use()
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan("dev"))

//Static Route
var frontEndPath = path.join(__dirname,'../','src','public');
app.use("/", express.static(frontEndPath));

//404 route
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));


module.exports = app;