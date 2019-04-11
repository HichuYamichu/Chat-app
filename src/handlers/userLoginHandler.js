const Database = require('../db/actions');

module.exports = async (req, res) => {
  const user = await Database.retriveUser(req.body.username);
  const servers = await Database.retriveServers(user.memberOf);
  const accessList = [];
  servers.forEach(server => {
    server.roles.forEach(role => {
      if (role.roleMembers.some(member => member === user.username)) {
        server.channels.filter(
          channel => !role.disallowedChannels.includes(channel.channelName)
        );
        role.serverName = server.serverName;
        accessList.push(role);
      }
    });
  });
  req.session.user = { username: user.username, accessList: accessList };
  res.send({ user, servers: servers });
};
