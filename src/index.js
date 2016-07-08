'use strict'; 

/* Express: consists of mostly middleware function calls

   Middleware functions: functions that have access to the request object, 
   response object, and next middleware function in the app's request-
   reponse cycle; logic that tells express how to handle a 
   request in b/t the time request is made by client and b/f it arrives 
   at a route 
*/ 

var express = require('express'); 

// Create an instrance of express - allows us to set up any middleware, configure routes, start the server 
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

// Add static server
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  //console.log(__dirname); 
  res.sendFile(__dirname + '/public/index.html');
});

/* Listen on the connection event for incoming sockets 
   Sockets allow communication between two different processes on the same 
   or different machines (way to talk to other computers) 
*/   
io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg); 
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});