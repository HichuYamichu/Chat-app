const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const server = require('http').Server(app);
const MongoDB = require('./db/index');
const Servers = require('./servers/index');
const io = require('socket.io')(server);

app.use(cors());
app.use(bodyParser.json());

MongoDB.connectDB(async err => {
  if (err) throw err;
  const db = MongoDB.getDB();

  app.use('/api/users', require('./routes/users'));
  app.use('/api/servers', require('./routes/servers'));

  const savedServers = await db
    .collection('servers')
    .find()
    .toArray();
  savedServers.forEach(savedServer => {
    Servers.createServer(savedServer.serverName);
  });

  server.listen(process.env.HOST || 3000, () => {
    console.log(`Server started on port: ${process.env.HOST || 3000}`);
  });
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});

module.exports.io = () => io;
