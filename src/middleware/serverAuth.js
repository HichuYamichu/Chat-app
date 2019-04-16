const Database = require('../db/actions');

module.exports = (serverName, channelNames) => async (socket, next) => {
  const { roles } = await Database.retriveServer(serverName);
  if (roles[0].roleMembers.includes(socket.handshake.session.user.username)) {
    const accessListEntry = roles.reduce(
      (activeRole, role) => {
        if (
          role.roleMembers.some(member => member === socket.handshake.session.user.username) &&
          role.roleLevel > activeRole.roleLevel
        ) {
          return (activeRole = role);
        }
      },
      { roleLevel: -1 }
    );
    channelNames.forEach(channelName => {
      if (accessListEntry.disallowedChannels.includes(channelName)) return;
      socket.join(channelName);
    });
    socket.user = socket.handshake.session.user;
    next();
  } else {
    socket.disconnect();
    next();
  }
};
