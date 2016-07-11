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
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');
});