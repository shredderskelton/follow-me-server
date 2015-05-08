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

var groups = {};

// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  console.log('body = ' + JSON.stringify(req.body));
  next();
});
 
app.param('groupId', function(req, res, next, id){

  //TODO put some validation in
  console.log('validation id = ' + id);
  next();

   // if(groupId === groupId){ 
      // req.groupId = groupId;
      // next();
    // } else {
    //   next(new Error('failed to load user'));
    // } 
});

app.get('/group/:groupId', function(req, res){

  var groupPins = groups[req.params.groupId];

  var ret = {
    group : req.params.groupId,
    members : groupPins
  };

  console.log('returning group with id = ' + req.params.groupId);
  res.setHeader('Content-Type', 'application/json');
  res.json(ret);
});

app.get('/search/:groupId', function(req, res){

  //build names for all groups 
  var groupKeys = [];
  for (var key in groups) {
      if (groups.hasOwnProperty(key)) {
          groupKeys.push(key);
      }
  }

  //find matches
  var matches = [];
  var idx=-1;
  
  for(var i=0; i<groupKeys.length; i++){
    idx = groupKeys[i].toLowerCase().indexOf(req.params.groupId);
    if(idx===0)
      matches.push(groupKeys[i]);
  }
 

  console.log('returning ' + matches.length + ' matches for: ' + req.params.groupId);
  res.setHeader('Content-Type', 'application/json');
  res.json(matches);
});

app.post('/group/:groupId/user/:username', function(req, res){

  console.log('group id = ' + req.params.groupId);
  console.log('username = ' + req.params.username);
  console.log('body = ' + JSON.stringify(req.body));

  var group = groups[req.params.groupId];

  if(typeof group === 'undefined'){
    console.log('Created group');
    group = {};
    group.members = [];
    group.group = req.params.groupId;
    groups[req.params.groupId] = group;
  }

  var members = group.members;
  var found = false;
  for(var i=0;i<members.length;i++){
    if(members[i].name === req.params.username){
      members[i] = req.body;
      break;
    }
  }

  if(!found){
    members.push(req.body);
  }

  res.setHeader('Content-Type', 'application/json'); 
  console.log('sendingback = ' + JSON.stringify(group));
  res.json(group);
});

function Follower(){

}

var port = Number(process.env.PORT || 3000);
app.listen(port, function() {
  console.log("Listening on " + port);
}); 