module.exports = serverName => (socket, next) => {
  socket.on('disconnect', () => {
    socket.server
      .of(serverName)
      .users.find(user => user.username === socket.user.username).active = false;
    socket.server.of(serverName).emit('updateActiveUsers', socket.server.of(serverName).users);
  });
  next();
};
