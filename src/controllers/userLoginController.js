const Database = require('../db/actions');

module.exports = async (req, res) => {
  const user = await Database.retriveUser(req.body.username);
  const servers = await Database.retriveServers(user.memberOf);
  servers.forEach(server => {
    const accessListEntry = server.roles.reduce(
      (activeRole, role) => {
        if (
          role.roleMembers.some(member => member === user.username) &&
          role.roleLevel > activeRole.roleLevel
        ) {
          return (activeRole = role);
        }
      },
      { roleLevel: -1 }
    );
    server.channels = server.channels.filter(
      channel => !accessListEntry.disallowedChannels.includes(channel.channelName)
    );
  });
  req.session.user = { username: user.username };
  res.send({ user, servers });
};
