module.exports = (serverName, Database) => (socket, next) => {
  socket.on('updateUserRole', async data => {
    if (data.actionType === 'assign') {
      const {
        value: { roles }
      } = await Database.addUserToRole(serverName, data.role, data.user);
      const connectedUser = Object.values(socket.server.of(serverName).sockets).find(
        connectedSocket => connectedSocket.user.username === data.user
      );
      if (connectedUser) {
        Object.entries(roles[0].permissions).forEach(permission => {
          if (permission[1]) {
            Object.values(socket.server.of(serverName).sockets).find(
              connectedSocket => connectedSocket.user.username === data.user
            ).user.permissions[permission[0]] = permission[1];
          }
        });
      }
    } else if (data.actionType === 'remove') {
      const {
        value: { roles }
      } = await Database.removeUserFromRole(serverName, data.role, data.user);
      const updatedUserRoles = roles.filter(
        role => role.roleMembers.includes(data.user) && role.roleName !== data.role
      );
      const userPermissions = {};
      const permissions = updatedUserRoles.map(role => role.permissions);
      permissions.forEach(permissionSet => {
        Object.entries(permissionSet).forEach(permission => {
          if (permission[1]) userPermissions[permission[0]] = permission[1];
        });
      });
      Object.values(socket.server.of(serverName).sockets).find(
        connectedSocket => connectedSocket.user.username === data.user
      ).user.permissions = userPermissions;
    }
    socket.server.of(serverName).emit('updateUserRole', data);
  });
  next();
};
