var http  = require('http'),
    login = require('./lib/login'),
    post  = require('./lib/post'),
    conf  = require('./lib/config');

login(function(result) {
  console.log(result);

  var options = {
    host: conf.host,
    port: conf.port,
    path: '/apns/register',
    method: 'POST'
  };

  var message = { 
    token: result.token,
    deviceToken: "abcd"
  };

  post(options, message, function(response) {
    console.log(response);
  });

});
