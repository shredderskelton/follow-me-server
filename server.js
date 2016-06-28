// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(1337, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:1337/');

// var redis = require("redis"),
// client = redis.createClient();

var express = require('express');
var http = require('http');
var app = express();
var logfmt = require("logfmt");
var fs = require('fs');
// var mqtt = require('./mosca-server.js')

app.use(express.bodyParser());
app.use(logfmt.requestLogger());

var groups = {};

// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  console.log('body = ' + JSON.stringify(req.body));
  next();
});
  
app.get('/me', function(req, res) {
  console.log("request");
  fs.readFile("me", function(err, text) {
    res.setHeader("Content-Type", "text/html");
    res.end(text);
  });
});

app.get('/ua-parser.min.js', function(req, res) {
  console.log("request");
  fs.readFile("ua-parser.min.js", function(err, text) {
    res.setHeader("Content-Type", "text/html");
    res.end(text);
  });
});

app.get('/test.html', function(req, res) {
  console.log("request");
  fs.readFile("test.html", function(err, text) {
    res.setHeader("Content-Type", "text/html");
    res.end(text);
  });
});

var port = Number(process.env.PORT || 3000);
app.server = http.createServer(app);

//MQTT

var mosca = require('mosca')
var mqttServer = new mosca.Server({});
mqttServer.attachHttpServer(app.server);

mqttServer.on('ready', setup);
 
// Accepts the connection if the username and password are valid
var authenticate = function(client, username, password, callback) {
  var shouldAuthenticate = false;
  if(process.env.MQTT_USERNAME) { 
    shouldAuthenticate = true; 
  }
  if(shouldAuthenticate){
    console.log('Authenticating');
    var authorized = (username === process.env.MQTT_USERNAME && password.toString() === process.env.MQTT_PASSWORD);
    if (authorized) client.user = username;
    callback(null, authorized);
  }else{
    callback(null, true);
  }
}

mqttServer.on('clientConnected', function(client) {
    console.log('client connected', client.id);     
});
 
mqttServer.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});
 
function setup() {
  mqttServer.authenticate = authenticate;
  console.log('Mosca server is up and running')
}

app.server.listen(3000 , function() {
  console.log("Listening on " + port);
}); 


