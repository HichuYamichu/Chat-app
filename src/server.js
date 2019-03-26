const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const server = require('http').Server(app);
const MongoDB = require('./db/index');
const Servers = require('./servers/index');
const io = require('socket.io')(server);
const sharedsession = require('express-socket.io-session');
const handshake = require('socket.io-handshake');

MongoDB.connectDB(async err => {
  if (err) throw err;
  const db = MongoDB.getDB();
  const store = new MongoStore({ db });

  const sessionMiddleware = session({
    store: store,
    key: 'express.sid',
    secret: process.env.SECRET || 'HIdi}65saUB.fws8DAL.;fPOq,(3',
    resave: true,
    httpOnly: false,
    secure: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60
    }
  });

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(sessionMiddleware);

  app.use('/api/users', require('./routes/users'));
  app.use('/api/servers', require('./routes/servers'));

  const savedServers = await db
    .collection('servers')
    .find()
    .toArray();
  savedServers.forEach(savedServer => {
    Servers.createServer(
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

module.exports.io = () => io;
