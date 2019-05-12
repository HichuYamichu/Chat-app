const Database = require('../db/actions');

module.exports = (serverID, channelIDs) => async (socket, next) => {
  if (socket.handshake.session.user) {
    const { roles } = await Database.retriveServer(serverID);
    if (roles[0].roleMembers.includes(socket.handshake.session.user._id)) {
      channelIDs.forEach(channelID => {
        socket.join(channelID);
      });
      socket.user = socket.handshake.session.user;
      socket.user.roles = [roles[0]];
      next();
    } else {
      next(new Error('Not authorized'));
    }
  } else {
    next(new Error('Not authenticated'));
  }
};
