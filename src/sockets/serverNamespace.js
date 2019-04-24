const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Database = require('../db/actions');
const sharedsession = require('express-socket.io-session');
const serverAuthMiddleware = require('../middleware/serverAuth');

module.exports = async (io, sessionMiddleware, serverName, channelNames, userList) => {
  io.of(serverName).use(
    sharedsession(sessionMiddleware, {
      autoSave: true
    })
  );

  io.of(serverName).use(serverAuthMiddleware(serverName, channelNames));
  io.of(serverName).users = userList;

  const modules = await readdir('./src/sockets/modules');
  modules.forEach(file => {
    if (!file.endsWith('.js')) return;
    io.of(serverName).use(require(`./modules/${file}`)(serverName, Database));
  });

  io.of(serverName).on('connection', socket => {
    if (
      io
        .of(serverName)
        .users.map(user => user.username)
        .includes(socket.user.username)
    ) {
      io.of(serverName).users.find(user => user.username === socket.user.username).active = true;
      io.of(serverName).emit('updateActiveUsers', io.of(serverName).users);
    } else {
      io.of(serverName).users.push({ username: socket.user.username, active: true });
      io.of(serverName).emit('userJoined', { username: socket.user.username, active: true });
    }
  });
};
