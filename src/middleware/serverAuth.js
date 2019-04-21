const Database = require('../db/actions');

module.exports = (serverName, channelNames) => async (socket, next) => {
  if (socket.handshake.session.user) {
    const { roles } = await Database.retriveServer(serverName);
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
      console.log(userPermissions);
      channelNames.forEach(channelName => {
        socket.join(channelName);
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
