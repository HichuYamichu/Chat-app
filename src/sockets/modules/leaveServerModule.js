module.exports = (serverID, Database) => (socket, next) => {
  socket.on('leaveServer', async () => {
    const {
      value: { users }
    } = await Database.leaveServer(serverID, socket.user._id);
    socket.disconnect();
    socket.server.of(serverID).emit('updateActiveUsers', users);
  });
  next();
};
