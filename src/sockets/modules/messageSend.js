module.exports = (serverName, Database) => (socket, next) => {
  socket.on('messageSend', data => {
    if (!socket.user.permissions.sendMessages) return;
    Database.insertMessage(serverName, data.channel, data.message);
    socket.server.of(serverName)
      .in(data.channel)
      .emit('messageRecived', data);
  });
  next();
};
