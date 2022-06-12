const express = require('express');
const app = express();

const fs = require('fs');
// cat chain cert public cert > sslcert/server.key
var privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

const server = require('https').createServer(credentials, app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8443;
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer')
const peer = ExpressPeerServer(server, {
	debug: true
});

const secret = "<token>"
let rooms = []

//Routes
app.use('/peerjs', peer);
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.sendStatus('403');
});
app.get('/join/:room', (req, res) => {
	if (rooms.includes(req.params.room)) {
		res.render('index', { RoomId: req.params.room });
	} else {
		res.sendStatus('403');
	};
});
app.get('/create/:secret', (req, res) => {
	if (req.params.secret == secret) {
		uuid = uuidv4();
		rooms.push(uuid);
		//res.send(uuid);
		res.redirect('/join/' + uuid);
	} else {
		res.sendStatus('403');
	};
});

//Socket
io.on("connection", (socket) => {
	socket.on('newUser', (id, room) => {
		socket.join(room);
		socket.to(room).broadcast.emit('userJoined', id);
		socket.on('disconnect', () => {
			socket.to(room).broadcast.emit('userDisconnect', id);
		})
	})
})

//Start server
server.listen(port, () => {
	console.log("Server running on port : " + port);
})
