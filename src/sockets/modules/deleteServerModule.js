module.exports = (serverID, Database) => (socket, next) => {
  socket.on('deleteServer', () => {
    Database.deleteServer(serverID);
    socket.server.of(serverID).emit('serverDelete', serverID);
    Object.values(socket.server.of(serverID).sockets).forEach(connectedSocket => {
      connectedSocket.disconnect();
    });
    delete socket.server.nsps[`/${serverID}`];
    require('fs').unlinkSync(`./src/assets/${serverID}.jpg`);
  });
  next();
};
