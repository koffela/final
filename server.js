var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

var port = process.env.PORT || 3000
server.listen(port);

console.log('Server running....');

app.use('/styles', express.static(__dirname + '/styles'));
app.use('/views', express.static(__dirname + '/views'));
app.use('/', express.static(__dirname + '/'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});




io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('connected: %s sockets connected', connections.length);

	//disconnect
	socket.on('disconnect', function(data){
		
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('disconnected: %s sockets connected', connections.length);
	});
	
	//send a message
	socket.on('send message', function(data){
		console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});
	
	//create a new user
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

function updateUsernames(){
		io.sockets.emit('get users', users);
	}
});
	
