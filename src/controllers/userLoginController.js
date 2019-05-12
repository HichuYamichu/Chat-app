const Database = require('../db/actions');

module.exports = async (req, res) => {
  const username = req.body.username || req.session.user.username;
  const user = await Database.retriveUser(username);
  const servers = await Database.retriveServers(user.memberOf);
  req.session.user = user;
  res.send({ user, servers });
};
