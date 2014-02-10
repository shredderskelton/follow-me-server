var http  = require('http'),
    login = require('./lib/login'),
    post  = require('./lib/post'),
    conf  = require('./lib/config');
  

  var message = { 
    "name": "nick", 
    "lat": 1000 ,
    "lon": 1000 
  };
  var messageTwo = { 
    "name": "dave", 
    "lat": 166 ,
    "lon": 666 
  };
  var messageThree = { 
    "name": "nick", 
    "lat": 167 ,
    "lon": 667 
  };

  var options = {
    host: conf.host,
    port: conf.port,
    path: '/session/abc/user/nick',
    method: 'POST'
  };

  post(options, message, function(response) {
    console.log(response);
  });
  
  console.log('-------------');
  
  post(options, messageTwo, function(response) {
    console.log(response);
  });
  
  console.log('-------------');
  
  post(options, messageThree, function(response) {
    console.log(response);
  });
 