module.exports = (serverID, Database) => (socket, next) => {
  socket.on('updateChannels', async channels => {
    console.log(channels)
    // const format = /[^A-Za-z]/;
    // for await (const channel of channels) {
    //   if (format.test(channel.channelName)) {
    //     return socket.emit('errorOccured', 'Illegal character in channel name!');
    //   }
    //   const taken = await Database.checkChannelNames(serverID, channel.channelName);
    //   if (taken) {
    //     return socket.emit('errorOccured', 'Channel name taken');
    //   }
    //   delete channel.overrides;
    //   const _id = Database.updateChannes(serverID, channel);
    //   channel._id = _id;
    //   Object.values(socket.server.of(serverID).sockets).forEach(connectedSocket =>
    //     connectedSocket.join(_id));
    //   socket.server.of(serverID).emit('addChannel', channel);
    // }
  });
  next();
};
