/**
 * The main entrance of the server, built on node js
 */
//declare variables here
const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const DataParser = require('./DataParser');
const io = require("socket.io")(http);
var configFile = require("./config");
var config = new configFile.Config();

//set up the environment
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
app.use(express.static(path.resolve(__dirname + "/../client")));
app.use(express.static(path.resolve(__dirname + "/../")));

//responsible for rendering html
var pid = 0;
var socketClient = null;
app.get('/', function (req, res) {
    io.on('connection', function (socket) {
        console.log("client is connected");
        socketClient = socket;
    });
    pid = req.query.pid;
    res.render(path.resolve(__dirname + "/../client/main.html"));
});


//responsible for get the image count
var dataParser = null;
var imageNumber = 0;
app.get('/getImageCount', function (req, res) {
    var dirPath = config.dirname + pid + "/";
    fs.readdir(dirPath, function (err, list) {
        dataParser = new DataParser(dirPath, list.length, registerUrls);
        dataParser.setup();
        imageNumber = list.length;
        res.end(String(list.length));

    });
});

//get the pixel data in json
app.get('/getPixel', function (req, res) {
    var index = req.query.index;
    res.send(dataParser.getPixel(index));
    res.end();
});


var registerUrls = function (property) {
    socketClient.emit("image",property);
};

http.listen(config.port, config.host, function() {
    console.log("server is running at http %d %s", config.port, config.host);
});