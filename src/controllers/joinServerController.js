const Database = require('../db/actions');

module.exports = async (serverName, username) => {
  try {
    const { _id } = await Database.getServerID(serverName);
    if (!_id) throw new Error('server not found');
    await Database.userJoin(_id, username);
    const server = await Database.retriveServers([_id]);
    return server;
  } catch (error) {
    throw error;
  }
};
