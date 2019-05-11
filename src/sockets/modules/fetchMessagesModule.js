module.exports = (serverID, Database) => (socket, next) => {
  socket.on('fetchMessages', async data => {
    const messages = await Database.fetchMessages(
      serverID,
      data.channel,
      data.lastMesssageTimestamp
    );
    socket.emit('updateMessages', { messages, channelID: data.channelID });
  });
  next();
};
