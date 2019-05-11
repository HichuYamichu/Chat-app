const sharedsession = require('express-socket.io-session');
const newServerController = require('../controllers/newServerController');
const joinServerController = require('../controllers/joinServerController');
const socketAuth = require('../middleware/mainSocketAuth');

module.exports = (io, sessionMiddleware) => {
  io.of('public').use(
    sharedsession(sessionMiddleware, {
      autoSave: true
    })
  );

  io.of('public').use(socketAuth);

  io.of('public').on('connection', socket => {
    console.log('connected to main');

    socket.on('logout', () => socket.disconnect());

    socket.on('createServer', async serverData => {
      try {
        const server = await newServerController(io, sessionMiddleware, socket, serverData);
        socket.emit('serverCreated', server);
      } catch (error) {
        socket.emit('errorOccured', error.message);
      }
    });

    socket.on('joinServer', async serverID => {
      try {
        const server = await joinServerController(
          socket,
          serverID,
          socket.handshake.session.user.username
        );
        server.users = [
          ...server.roles[0].roleMembers.map(member => ({ username: member, active: false }))
        ];
        socket.emit('joinedServer', server);
      } catch (error) {
        socket.emit('errorOccured', error.message);
      }
    });
  });
};
