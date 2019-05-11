const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Database = require('../db/actions');
const sharedsession = require('express-socket.io-session');
const serverAuthMiddleware = require('../middleware/serverAuth');

module.exports = async (io, sessionMiddleware, serverID, channelIDs, userList) => {
  io.of(serverID).use(
    sharedsession(sessionMiddleware, {
      autoSave: true
    })
  );

  io.of(serverID).use(serverAuthMiddleware(serverID, channelIDs));
  io.of(serverID).users = userList;

  const modules = await readdir('./src/sockets/modules');
  modules.forEach(file => {
    if (!file.endsWith('.js')) return;
    io.of(serverID).use(require(`./modules/${file}`)(serverID, Database));
  });

  io.of(serverID).on('connection', socket => {
    if (
      io
        .of(serverID)
        .users.map(user => user.username)
        .includes(socket.user.username)
    ) {
      io.of(serverID).users.find(user => user.username === socket.user.username).active = true;
      io.of(serverID).emit('updateActiveUsers', io.of(serverID).users);
    } else {
      io.of(serverID).users.push({ username: socket.user.username, active: true });
      io.of(serverID).emit('userJoined', { username: socket.user.username, active: true });
    }
  });
};
