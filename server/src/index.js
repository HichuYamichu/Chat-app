const app = require('express')();
const server = require('http').Server(app);
const cors = require('cors');
const bodyParser = require('body-parser');
const io = require('socket.io')(server);
const MongoDB = require('./db/index');
const Servers = require('./servers/index');
const HOST = process.env.HOST || 3000;

// require('./servers/handler')(io);

MongoDB.connectDB(async err => {
	if (err) throw err;
	const db = MongoDB.getDB();

	app.use(cors());
	app.use(bodyParser.json());

	app.post('/api/new-server', (req, res) => {
		Servers.createServer(req.body.serverName, io);
		res.sendStatus(200);
	});

	server.listen(HOST || 3000, () => {
		console.log(`Server started on port: ${HOST}`);
	});

	// io.on('connection', socket => {
	// 	socket.on('createServer', data => {
	// 		console.log(data);
	// 		Servers.createServer(io, socket, data);
	// 		console.log(io);
	// 	});
	// });
});

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
