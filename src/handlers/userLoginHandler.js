const Database = require('../db/actions');

module.exports = async (req, res) => {
  const user = await Database.retriveUser(req.body.username);
  const serversArr = await Database.retriveServers(user.memberOf);
  const serversObj = {};
  const accessList = [];
  serversArr.forEach(server => {
    serversObj[server.serverName] = server;
    serversObj[server.serverName].roles.forEach(role => {
      serversObj[server.serverName].channels = serversObj[server.serverName].channels.filter(channel => !role.disallowedChannels.includes(channel.channelName));
      if (role.roleMembers.some(member => member === user.username)) {
        role.serverName = server.serverName;
        accessList.push(role);
      }
    });
  });
  req.session.user = { username: user.username, accessList: accessList };
  res.send({ user, servers: serversObj });
};
