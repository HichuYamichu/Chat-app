const Database = require('../db/actions');

module.exports = (serverID, channelIDs) => async (socket, next) => {
  if (socket.handshake.session.user) {
    const { roles } = await Database.retriveServer(serverID);
    const userRoles = roles.filter(role =>
      role.roleMembers.includes(socket.handshake.session.user.username));
    if (userRoles.length) {
      const userPermissions = {};
      const permissions = userRoles.map(role => role.permissions);
      permissions.forEach(permissionSet => {
        Object.entries(permissionSet).forEach(permission => {
          if (permission[1]) userPermissions[permission[0]] = permission[1];
        });
      });
      channelIDs.forEach(channelID => {
        socket.join(channelID);
      });
      socket.user = socket.handshake.session.user;
      socket.user.permissions = userPermissions;
      next();
    } else {
      next(new Error('Not authorized'));
    }
  } else {
    next(new Error('Not authenticated'));
  }
};
