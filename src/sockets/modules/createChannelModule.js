module.exports = (serverID, Database) => (socket, next) => {
  socket.on('createChannel', async data => {
    const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(data)) {
      return socket.emit('errorOccured', 'Illegal character in channel name!');
    }
    const taken = await Database.checkChannelNames(serverID, data);
    if (taken) {
      return socket.emit('errorOccured', 'Channel name taken');
    }

    const channel = { channelName: data, messages: [] };
    const _id = Database.addChannel(serverID, channel);
    channel._id = _id;
    Object.values(socket.server.of(serverID).sockets).forEach(connectedSocket =>
      connectedSocket.join(_id));
    socket.server.of(serverID).emit('addChannel', channel);
  });
  next();
};
