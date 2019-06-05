const premissionPolicy = require('../../policies/premissionPolicy');

module.exports = (serverID, Database) => (socket, next) => {
  socket.on('messageSend', data => {
    const pass = premissionPolicy(socket.user.roles, 'sendMessages', data.channelID);
    if (!pass) return;
    Database.insertMessage(serverID, data.channelID, data.message);
    socket.server.of(serverID)
      .in(data.channelID)
      .emit('messageRecived', data);
  });
  next();
};
