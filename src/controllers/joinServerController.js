const Database = require('../db/actions');

module.exports = async (socket, serverID, username) => {
  await Database.userJoin(serverID, username);
  const server = await Database.retriveServers([serverID]);
  return server[0];
};
