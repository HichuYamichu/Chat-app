const Database = require('../db/actions');
const { ObjectID } = require('mongodb');

module.exports = async (socket, serverID) => {
  await Database.userJoin(serverID, {
    _id: socket.handshake.session.user._id,
    username: socket.handshake.session.user.username,
    active: false
  });
  const server = await Database.retriveServers([new ObjectID(serverID).toString()]);
  return server[0];
};
