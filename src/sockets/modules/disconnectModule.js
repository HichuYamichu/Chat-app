module.exports = serverID => (socket, next) => {
  socket.on('disconnect', () => {
    socket.server
      .of(serverID)
      .users.find(user => user.username === socket.user.username).active = false;
    socket.server.of(serverID).emit('updateActiveUsers', socket.server.of(serverID).users);
  });
  next();
};
