const sharedsession = require('express-socket.io-session');
const newServerController = require('../controllers/newServerController');
const joinServerController = require('../controllers/joinServerController');

module.exports = (io, sessionMiddleware) => {
  io.of('public').use(
    sharedsession(sessionMiddleware, {
      autoSave: true
    })
  );

  io.of('public').on('connection', socket => {
    console.log('connected');
    if (!socket.handshake.session) return socket.disconnect();

    socket.on('createServer', async serverData => {
      try {
        console.log(serverData);
        const server = await newServerController(io, sessionMiddleware, socket, serverData);
        socket.emit('serverCreated', server);
      } catch (error) {
        console.log(error);
        socket.emit('errorOccured', { error });
      }
    });

    socket.on('joinServer', async serverName => {
      try {
        const server = await joinServerController(
          serverName,
          socket.handshake.session.user.username
        );
        socket.emit('joinedServer', server);
      } catch (error) {
        socket.emit('errorOccured', error);
      }
    });
  });
};
