module.exports = (serverID, Database) => (socket, next) => {
  socket.on('disconnect', async () => {
    const { value } = await Database.updateUserStatus(serverID, socket.user._id, false);
    if (value) {
      socket.server.of(serverID).emit('updateActiveUsers', value.users);
    }
  });
  next();
};
