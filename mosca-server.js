var mosca = require('mosca')
 
var moscaSettings = {
  port: 1883,
  host: "0.0.0.0", // specify an host to bind to a single interface
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
  var shouldAuthenticate = false;
  if(process.env.MQTT_USERNAME) { 
    shouldAuthenticate = true; 
    console.log('Authentication enabled');   
  }else{
    console.log('Authentication disabled');   
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