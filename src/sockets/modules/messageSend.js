module.exports = (serverID, Database) => (socket, next) => {
  socket.on('messageSend', data => {
    if (!socket.user.permissions.sendMessages) return;
    Database.insertMessage(serverID, data.channel, data.message);
    socket.server.of(serverID)
      .in(data.channelID)
      .emit('messageRecived', data);
  });
  next();
};
