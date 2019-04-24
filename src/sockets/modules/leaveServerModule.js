module.exports = (serverName, Database) => (socket, next) => {
  socket.on('leaveServer', () => {
    Database.leaveServer(serverName, socket.user.username);
    socket.disconnect();
    socket.server.of(serverName).users.filter(users => users.username !== socket.user.username);
    socket.server.of(serverName).emit('updateActiveUsers', socket.server.of(serverName).users);
  });
  next();
};
