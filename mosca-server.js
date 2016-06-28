console.log(process.pid);
require('daemon')();
var mosca = require('mosca')
 
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
  }
};
 
var server = new mosca.Server(moscaSettings);
server.on('ready', setup);
 
// Accepts the connection if the username and password are valid
var authenticate = function(client, username, password, callback) {
  var authorized = (username === process.env.MQTT_USERNAME && password.toString() === process.env.MQTT_USERNAME);
  if (authorized) client.user = username;
  callback(null, authorized);
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
console.log(process.pid);