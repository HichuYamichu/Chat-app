module.exports = (serverName, Database) => (socket, next) => {
  socket.on('deleteChannel', async channelName => {
    if (channelName === 'main') {
      return socket.emit('errorOccured', 'You can not delete main channel');
    }
    const exists = await Database.checkChannelNames(serverName, channelName);
    if (exists) {
      Database.deleteChannel(serverName, channelName);
      Object.values(socket.server.of(serverName).sockets).forEach(connectedSocket => {
        connectedSocket.leave(channelName);
      });
      socket.server.of(serverName).emit('channelDeleted', channelName);
    } else {
      socket.emit('errorOccured', 'There is no channel with that name');
    }
  });
  next();
};
