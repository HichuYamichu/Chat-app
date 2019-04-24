module.exports = (serverName, Database) => (socket, next) => {
  socket.on('createChannel', async data => {
    const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(data)) {
      return socket.emit('errorOccured', 'Illegal character in channel name!');
    }
    const taken = await Database.checkChannelNames(serverName, data);
    if (taken) {
      return socket.emit('errorOccured', 'Channel name taken');
    }
    Object.values(socket.server.of(serverName).sockets).forEach(connectedSocket => connectedSocket.join(data));

    const channel = { channelName: data, messages: [] };
    Database.addChannel(serverName, channel);
    socket.server.of(serverName).emit('addChannel', channel);
  });
  next();
};
