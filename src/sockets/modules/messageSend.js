module.exports = (serverID, Database) => (socket, next) => {
  socket.on('messageSend', data => {
    const topRole = socket.user.roles[socket.user.roles.length - 1];
    let activePremissionSet = topRole.permissionSets.find(set => set._id === data.channelID);
    if (!activePremissionSet) activePremissionSet = topRole.permissionSets[0];
    if (!activePremissionSet.permissions.sendMessages) return;
    Database.insertMessage(serverID, data.channelID, data.message);
    socket.server.of(serverID)
      .in(data.channelID)
      .emit('messageRecived', data);
  });
  next();
};
