const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const MongoDB = require('./db/index');
const Servers = require('./servers/index');
const Database = require('./db/actions');

app.use(cors());
app.use(bodyParser.json());

MongoDB.connectDB(async err => {
	if (err) throw err;
	const db = MongoDB.getDB();

	const savedServers = await db.collection('servers').find().toArray();
	savedServers.forEach(savedServer => {
		Servers.createServer(io, savedServer.serverName);
	});

	app.post('/api/new-server', async (req, res) => {
		const isTaken = await Database.checkServerNames(db, req.body.serverName);
		if (isTaken) return res.status(500).send({ error: 'Name already taken' });
		Database.createServer(db, req.body);
		Servers.createServer(io, req.body.serverName);
		res.sendStatus(200);
	});

	app.post('/api/register', (req, res) => {
		const isTaken = Database.checkUserNames(db, req.body.userName);
		if (isTaken) return res.status(500).send({ error: 'Username already taken' });
		Database.insertUser(db, req.body);
		res.sendStatus(200);
	});

	app.post('/api/login', (req, res) => {
		try {
			Database.retriveUser(db, req.body);
			res.send(200);
		} catch (error) {
			res.sendStatus(500);
		}
	});

	server.listen(process.env.HOST || 3000, () => {
		console.log(`Server started on port: ${process.env.HOST || 3000}`);
	});
});

process.on('unhandledRejection', (reason, p) => {
	console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
