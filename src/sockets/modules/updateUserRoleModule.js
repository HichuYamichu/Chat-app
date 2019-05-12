module.exports = (serverID, Database) => (socket, next) => {
  socket.on('updateUserRole', async data => {
    if (data.actionType === 'assign') {
      console.log(data);
      const connectedUser = Object.values(socket.server.of(serverID).sockets).find(
        connectedSocket => connectedSocket.user._id === data.userID
      );
      if (connectedUser) {
        const {
          value: { roles }
        } = await Database.addUserToRole(serverID, data.roleID, data.userID);
        connectedUser.roles.push(data.roleID);
        console.log(data.roleID);
        const test = Object.values(socket.server.of(serverID).sockets).find(
          connectedSocket => connectedSocket.user.username === data.userID
        );
        console.log(test);
      }
    } else if (data.actiIDonType === 'remove') {
      const {
        value: { roles }
      } = await Database.removeUserFromRole(serverID, data.roleID, data.userID);
      const updatedUserRoles = roles.filter(
        role => role.roleMembers.includes(data.userID) && role.roleName !== data.roleID
      );
      const userPermissions = {};
      const permissions = updatedUserRoles.map(role => role.permissions);
      permissions.forEach(permissionSet => {
        Object.entries(permissionSet).forEach(permission => {
          if (permission[1]) userPermissions[permission[0]] = permission[1];
        });
      });
      // FIX FOR INACTIVE USERS
      Object.values(socket.server.of(serverID).sockets).find(
        connectedSocket => connectedSocket.user.username === data.userID
      ).user.permissions = userPermissions;
    }
    socket.server.of(serverID).emit('updateUserRole', data);
  });
  next();
};
