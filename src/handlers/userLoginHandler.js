const Database = require('../db/actions');

module.exports = async (req, res) => {
  const user = await Database.retriveUser(req.body.username);
  const servers = await Database.retriveServers(user.memberOf);
  const accessList = [];
  Object.keys(servers).forEach(server => accessList.push(servers[server].serverName));
  req.session.user = { username: user.username, memberOf: accessList };
  res.send({ user, servers });
};
