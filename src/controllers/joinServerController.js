const Database = require('../db/actions');

module.exports = async (socket, serverName, username) => {
  const { _id } = await Database.getServerID(serverName);
  if (!_id) throw new Error('server not found');
  console.log(serverName);
  await Database.userJoin(_id, username);
  const server = await Database.retriveServers([_id]);
  return server[0];
};
