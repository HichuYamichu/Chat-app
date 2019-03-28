const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const bodyParser = require('body-parser');
const sessionConfig = require('./sessionConfig');
const MongoDB = require('./db/index');
const SocketHandler = require('./socket/index');

MongoDB.connectDB(async err => {
  if (err) throw err;
  const db = MongoDB.getDB();
  await sessionConfig.init(db);

  app.use(
    cors({
      origin: 'http://localhost:8080',
      credentials: true
    })
  );

  app.use(sessionConfig.getSession());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/users', require('./routes/users'));
  app.use('/api/servers', require('./routes/servers'));

  const savedServers = await db
    .collection('servers')
    .find()
    .toArray();

  savedServers.forEach(savedServer => {
    SocketHandler.createServer(
      io,
      savedServer.serverName,
      savedServer.channels.map(channel => channel.channelName)
    );
  });

  server.listen(process.env.HOST || 3000, () => {
    console.log(`Server started on port: ${process.env.HOST || 3000}`);
  });
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
