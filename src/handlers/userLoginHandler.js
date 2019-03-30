const Database = require('../db/actions');

module.exports = async (req, res) => {
  const user = await Database.retriveUser(req.body.username);
  const serversArr = await Database.retriveServers(user.memberOf);
  const serversObj = {};
  serversArr.forEach(server => {
    serversObj[server.serverName] = server;
  });
  const userServers = await Database.getAccesList(
    user.username,
    serversArr.map(server => server.serverName)
  );
  const accessList = [];
  userServers.forEach(server => {
    accessList.push({
      serverName: server.serverName,
      disallowedChannels: server.roles.disallowedChannels
    });
  });
  Object.keys(serversObj).forEach(server => {
    const currentAccessListEntry = accessList.find(entry => entry.serverName === server);
    const allowedChannels = serversObj[server].channels.filter(channel => !currentAccessListEntry.disallowedChannels.includes(channel.channelName));
    serversObj[server].channels = allowedChannels;
  });
  req.session.user = { username: user.username, accessList: accessList };
  res.send({ user, servers: serversObj });
};
