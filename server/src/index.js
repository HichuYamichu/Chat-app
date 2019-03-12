const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const MongoDB = require('./db/index');
const Servers = require('./servers/index');
const HOST = process.env.HOST || 3000;

MongoDB.connectDB(async err => {
	if (err) throw err;
	const db = MongoDB.getDB();

	server.listen(HOST || 3000, () => {
		console.log(`Server started on port: ${HOST}`);
	});

	io.on('connection', socket => {
		socket.on('createServer', data => {
			console.log(data);
			Servers.createServer(io, socket, data);
		});
	});
});

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
