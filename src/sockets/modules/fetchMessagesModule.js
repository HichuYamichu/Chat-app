module.exports = (serverName, Database) => (socket, next) => {
  socket.on('fetchMessages', async data => {
    const messages = await Database.fetchMessages(
      serverName,
      data.channel,
      data.lastMesssageTimestamp
    );
    socket.emit('updateMessages', { messages, channelName: data.channel });
  });
  next();
};
