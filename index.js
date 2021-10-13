// import all dependencies
const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');

// and route pages
let homepage = require('./routes/home');
let loginpage = require('./routes/login');
let liveditorpage = require('./routes/liveditor');
let aboutpage = require('./routes/about');

//port to listen requests
var PORT = process.env.PORT || 3000;

// initialize app
const app = express();

//set templating engine and folder
app.set('view engine','ejs');
app.set('views','./views');


//socket chat test
app.get('/test', function(req,res) {
	res.sendFile(__dirname+'/test/clientsocket.html');
});

//for request body access and sessions
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(session({ secret: "saditheunknownlegendbysadiboy", resave: true, saveUninitialized: true }));

//routes
app.use('/', homepage);
app.use('/login', loginpage);
app.use('/liveditor', liveditorpage);
app.use('/about', aboutpage);


//create my server to handle requus
server = app.listen(PORT, function() { console.log('server running at http://localhost:3000'); }); 
const io = require('socket.io')(server);

// users
let users = [];
let totalusers = 0;

//setting up socket for chats
io.on('connection', function(socket) {

	if(totalusers >= 3) {
		console.log('max users exceeded..!'); // no user entry
		socket.disconnect();
		// exit the session return false; 
	} else {
			// num of users connected
		totalusers++;
			// save each user id and their box
		const socketId = socket.id;
		users.push({ socketId: socketId, chatbox: totalusers })
		console.log('-- a user connected to chat, total : '+totalusers);
			// send user chat box and total info to new socket connection
		socket.emit('setmychatbox', { allusers: users, mychatbox: totalusers });
	}

		// recieve public text editor handler
	socket.on('publicedit', function(data) {
		// send to everyone except sender
		socket.broadcast.emit('publicedit', { newedit: data.newedit, editby: data.chattername });
	});
		// recieve new chat message handler
	socket.on('newmessage', function(data) {
		// send to others msg and info
		socket.broadcast.emit('newmessage', { newmsg: data.newmsg, from: data.from, chatbox: data.chatbox });
	});

		// update user chat names
	socket.on('updatename', function(data) {
		let updatedName = data;
		let updatedUserBox = 0;
		users.forEach((user) => {
			if(user.socketId == socket.id) { // found him in list
				user.chattername = updatedName;
				updatedUserBox = Number(user.chatbox);
				// console.log('updatename, userbox= ', user.chatbox);
			} // inform others too
			socket.broadcast.emit('updatename', { updatedName: updatedName, updatedUserBox: updatedUserBox });
		});
	});
		// handle disconnect
	socket.on('disconnect', function() {
		let disconnectedBox;
		totalusers--;
		console.log('-- a user exited chat, total : '+totalusers);
			// find disconnected box
		users.forEach((user) => {
			if(user.socketId == socket.id)
				disconnectedBox = user.chatbox;
				delete user;
		});
			// send discnntd bx
		socket.broadcast.emit('exituser', disconnectedBox);
	});

});