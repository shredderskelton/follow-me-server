// console.log(process.pid);
// console.log('am i crazy');
// require('daemon')();

var mosca = require('mosca')

process.on('uncaughtException', function (exception) {
  console.log(exception); // to see your exception details in the console
  // if you are on production, maybe you can send the exception details to your
  // email as well ?
});
// var backjack = {
//   type: 'redis',
//   db: 12,
//   port: 6379,
//   return_buffers: true,
//   host: "localhost"
// };
 
var moscaSettings = {
  port: 1883,
  host: "127.0.0.1", // specify an host to bind to a single interface
  id: 'followme', // used to publish in the $SYS/<id> topicspace
  stats: true, // publish stats in the $SYS/<id> topicspace
  logger: {
    level: 'info'
  },
  http: {
    port: 1884
  }
};
 
var server = new mosca.Server(moscaSettings);
server.on('ready', setup);
 
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

server.on('clientConnected', function(client) {
    console.log('client connected', client.id);     
});
 
server.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});
 
function setup() {
  server.authenticate = authenticate;
  console.log('Mosca server is up and running')
}

//console.log(process.pid);