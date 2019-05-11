module.exports = (serverID, Database) => (socket, next) => {
  socket.on('leaveServer', () => {
    Database.leaveServer(serverID, socket.user.username);
    socket.disconnect();
    socket.server.of(serverID).users.filter(users => users.username !== socket.user.username);
    socket.server.of(serverID).emit('updateActiveUsers', socket.server.of(serverID).users);
  });
  next();
};
