const Database = require('../db/actions');

module.exports = async (req, res) => {
  const user = await Database.retriveUser(req.body.username);
  const servers = await Database.retriveServers(user.memberOf);
  servers.forEach(server => {
    let activeRole = { roleLevel: -1 };
    server.roles.forEach(role => {
      if (
        role.roleMembers.some(member => member === user.username) &&
        role.roleLevel > activeRole.roleLevel
      ) {
        activeRole = role;
      }
    });
    server.users = [...server.roles[0].roleMembers.map(member => {
      return { username: member, active: false };
    })];
    console.log(server.users);
    server.channels = server.channels.filter(channel =>
      !activeRole.disallowedChannels.includes(channel.channelName));
  });
  req.session.user = { username: user.username };
  res.send({ user, servers });
};
