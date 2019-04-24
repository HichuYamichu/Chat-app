module.exports = (serverName, Database) => (socket, next) => {
  socket.on('deleteServer', () => {
    Database.deleteServer(serverName);
    socket.server.of(serverName).emit('serverDelete', serverName);
    Object.values(socket.server.of(serverName).sockets).forEach(connectedSocket => {
      connectedSocket.disconnect();
    });
    delete socket.server.nsps[`/${serverName}`];
  });
  next();
};
