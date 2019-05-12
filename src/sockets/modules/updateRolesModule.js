const { ObjectID } = require('mongodb');

module.exports = (serverID, Database) => (socket, next) => {
  socket.on('updateRoles', roles => {
    roles.forEach(role => {
      if (!role._id) {
        role._id = new ObjectID();
      }
    });
    Database.updateRoles(serverID, roles);
    Object.values(socket.server.of(serverID).sockets).forEach(connectedSocket => {
      const newUserRoles = roles.filter(role =>
        role.roleMembers.includes(connectedSocket.user.username));
      connectedSocket.user.roles = newUserRoles;
    });
    socket.server.of(serverID).emit('updateRoles', roles);
  });
  next();
};
