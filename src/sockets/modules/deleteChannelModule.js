module.exports = (serverID, Database) => (socket, next) => {
  socket.on('deleteChannel', async channelID => {
    // if (channelName === 'main') {
    //   return socket.emit('errorOccured', 'You can not delete main channel');
    // }
    Database.deleteChannel(serverID, channelID);
    Object.values(socket.server.of(serverID).sockets).forEach(connectedSocket => {
      connectedSocket.leave(channelID);
    });
    socket.server.of(serverID).emit('channelDeleted', channelID);
  });
  next();
};
