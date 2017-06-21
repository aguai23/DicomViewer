/**
 * This file is used to serve data for cornerstone usage
 */
const express = require('express');
const path = require('path');
const app = express();
const http = require("http").Server(app);

let configFile = require("./config");
let config = new configFile.Config();

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(express.static(path.resolve(config.dirname)));

http.listen(config.dataPort, config.dataHostname, () => {
    console.log('server is running at http %s:%d',config.dataHostname,config.dataPort);
});
