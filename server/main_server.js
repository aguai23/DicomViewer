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
let configFile = require("./config");
let config = new configFile.Config();

//set up the environment
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
app.use(express.static(path.resolve(__dirname + "/../client")));
app.use(express.static(path.resolve(__dirname + "/../")));

//responsible for rendering html
let pid = 0;
let socketClient = null;
app.get('/', function (req, res) {
    io.on('connection', function (socket) {
        console.log("client is connected");
        socketClient = socket;
    });
    pid = req.query.pid;
    res.render(path.resolve(__dirname + "/../client/main.html"));
});


//responsible for get the image count
let dataParser = null;
let imageNumber = 0;
app.get('/getImageCount', function (req, res) {
    let dirPath = config.dirname + pid + "/";
    fs.readdir(dirPath, function (err, list) {
        dataParser = new DataParser(dirPath, list.length, registerUrls);
        imageNumber = list.length;
        res.end(String(list.length));

    });
});

//get the pixel data in json
app.get('/getPixel', function (req, res) {
    let index = req.query.index;
    res.send(dataParser.getPixel(index));
    res.end();
});


let registerUrls = function (property) {
    socketClient.emit("image",property);
};

http.listen(config.port, config.host, () => {
    console.log("server is running at http %d %s", config.port, config.host);
});