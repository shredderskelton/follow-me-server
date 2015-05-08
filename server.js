// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(1337, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:1337/');

// var redis = require("redis"),
// client = redis.createClient();

var express = require('express');
var app = express();
var logfmt = require("logfmt");

app.use(express.bodyParser());
app.use(logfmt.requestLogger());

var sessions = {};

// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  console.log('body = ' + req.body);
  next();
});
 
app.param('sessionId', function(req, res, next, id){

  //TODO put some validation in
  console.log('validation id = ' + id);
  next();

   // if(sessionId === sessionId){ 
      // req.sessionId = sessionId;
      // next();
    // } else {
    //   next(new Error('failed to load user'));
    // } 
});

app.get('/session/:sessionId', function(req, res){

  var sessionPins = sessions[req.params.sessionId];

  var ret = {
    session : req.params.sessionId,
    pins : sessionPins
  };

  console.log('returning session with id = ' + req.params.sessionId);
  res.setHeader('Content-Type', 'application/json');
  res.json({result : ret});
});

app.get('/search/:sessionId', function(req, res){

  //build names for all sessions 
  var sessionKeys = [];
  for (var key in sessions) {
      if (sessions.hasOwnProperty(key)) {
          sessionKeys.push(key);
      }
  }

  //find matches
  var matches = [];
  var idx=-1;
  
  for(var i=0; i<sessionKeys.length; i++){
    idx = sessionKeys[i].toLowerCase().indexOf(req.params.sessionId);
    if(idx===0)
      matches.push(sessionKeys[i]);
  }
 

  console.log('returning ' + matches.length + ' matches for: ' + req.params.sessionId);
  res.setHeader('Content-Type', 'application/json');
  res.json(matches);
});

app.post('/session/:sessionId/user/:username', function(req, res){

  console.log('session id = ' + req.params.sessionId);
  console.log('username = ' + req.params.username);
  console.log('body = ' + req.body);

  var session = sessions[req.params.sessionId];

  if(typeof session === 'undefined'){
    console.log('Created session');
    session = {};
    sessions[req.params.sessionId] = session;
  }

  session[req.body.name] = req.body;

  res.setHeader('Content-Type', 'application/json'); 
  res.json({result : session});
});

function Follower(){

}

var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
  console.log("Listening on " + port);
}); 