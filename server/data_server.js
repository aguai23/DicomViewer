/**
 * This file is used to serve data for cornerstone usage
 */
var express = require('express');
var path = require('path');
var app = express();
var http = require("http").Server(app);

var configFile = require("./config");
var config = new configFile.Config();

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static(path.resolve(config.dirname)));

http.listen(config.dataPort, config.dataHostname, function () {
    console.log('server is running at http %s:%d', config.dataHostname, config.dataPort);
});

