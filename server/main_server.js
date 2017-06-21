/**
 * The main entrance of the server, built on node js
 */

const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);

app.engine('html', require('ejs').renderFile);
app.set('view engine','html');
app.use(express.static(path.resolve(__dirname + "/../client")));
app.use(express.static(path.resolve(__dirname + "/../")));

app.get('/', function (req, res) {
   res.render(path.resolve(__dirname + "/../client/main.html"));
});

http.listen(3600, "127.0.0.1", () => {
    console.log("server is running at http %s %d", "127.0.0.1",3600);
});