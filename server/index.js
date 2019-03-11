const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const HOST = process.env.HOST || 3000;


server.listen(HOST || 3000, () => {
	console.log(`Server started on port: ${HOST}`);
});

io.on('connection', socket => {
	socket.on('testing', data => {
		console.log(data);
	});
});
