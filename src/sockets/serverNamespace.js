const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Database = require('../db/actions');
const sharedsession = require('express-socket.io-session');
const serverAuthMiddleware = require('../middleware/serverAuth');

module.exports = async (io, sessionMiddleware, serverID, channelIDs) => {
  io.of(serverID).use(
    sharedsession(sessionMiddleware, {
      autoSave: true
    })
  );

  io.of(serverID).use(serverAuthMiddleware(serverID, channelIDs));

  const modules = await readdir('./src/sockets/modules');
  modules.forEach(file => {
    if (!file.endsWith('.js')) return;
    io.of(serverID).use(require(`./modules/${file}`)(serverID, Database));
  });

  io.of(serverID).on('connection', async socket => {
    const {
      value: { users }
    } = await Database.updateUserStatus(serverID, socket.user._id, true);
    io.of(serverID).emit('updateActiveUsers', users);
  });
};
