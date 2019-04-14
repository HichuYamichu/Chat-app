const Servers = require('../socket/index');
const Database = require('../db/actions');

module.exports = async (req, res) => {
  const { ops } = await Database.createServer(req.body);
  const server = ops[0];
  server.roles.forEach(role => {
    if (role.roleMembers.some(member => member === req.session.user.username)) {
      server.channels.filter(channel => !role.disallowedChannels.includes(channel.channelName));
      role.serverName = server.serverName;
      req.session.user.accessList.push({
        roleName: role.roleName,
        disallowedChannels: role.disallowedChannels,
        permissions: role.permissions,
        serverName: server.serverName
      });
    }
  });
  Servers.createServer(server.serverName, server.channels.map(channel => channel.channelName));
  res.send(server);
};
