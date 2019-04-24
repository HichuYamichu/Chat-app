module.exports = (serverName, Database) => (socket, next) => {
  socket.on('updateRoles', roles => {
    Database.updateRoles(serverName, roles);
    Object.values(socket.server.of(serverName).sockets).forEach(connectedSocket => {
      const newUserRoles = roles.filter(role =>
        role.roleMembers.includes(connectedSocket.user.username));
      const userPermissions = {};
      const permissions = newUserRoles.map(role => role.permissions);
      permissions.forEach(permissionSet => {
        Object.entries(permissionSet).forEach(permission => {
          if (permission[1]) userPermissions[permission[0]] = permission[1];
        });
      });
      connectedSocket.user.permissions = userPermissions;
    });
    socket.server.of(serverName).emit('updateRoles', roles);
  });
  next();
};
