const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const bodyParser = require('body-parser');
const sessionConfig = require('./sessionConfig');
const MongoDB = require('./db/index');
const history = require('connect-history-api-fallback');
const { prepareQueries } = require('./db/actions');
const createServer = require('./sockets/serverNamespace');
const initPublicNamespace = require('./sockets/publicNamespace');

MongoDB.connectDB(async err => {
  if (err) throw err;

  const db = MongoDB.getDB();
  await sessionConfig.init(db);
  prepareQueries(db);

  app.use(
    cors({
      origin: ['http://localhost:8080', 'http://localhost:8081', 'app://chat-app-client'],
      credentials: true
    })
  );

  const sessionMiddleware = sessionConfig.getSession();
  app.use(sessionMiddleware);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/users', require('./routes/users'));
  app.use('/api/servers', require('./middleware/httpAuth'));
  app.use('/api/servers', require('./routes/servers'));

  const staticFileMiddleware = express.static('dist');
  app.use(staticFileMiddleware);
  app.use(
    history({})
  );
  app.use(staticFileMiddleware);
  app.use('/static', express.static('./assets'));
  app.use('/download', express.static('./dist_electron'));

  initPublicNamespace(io, sessionMiddleware);
  const savedServers = await db
    .collection('servers')
    .find()
    .toArray();

  savedServers.forEach(savedServer => {
    createServer(
      io,
      sessionMiddleware,
      savedServer._id.toString(),
      savedServer.channels.map(channel => channel._id)
    );
  });

  server.listen(process.env.HOST || 3000, () => {
    console.log(`Server started on port: ${process.env.HOST || 3000}`);
  });
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
