const Database = require('../db/actions');

module.exports = async (req, res) => {
  const user = await Database.retriveUser(req.body.username);
  const servers = await Database.retriveServers(user.memberOf);
  servers.forEach(server => {
    server.users = [
      ...server.roles[0].roleMembers.map(member => ({ username: member, active: false }))
    ];
  });
  req.session.user = { username: user.username };
  res.send({ user, servers });
};
