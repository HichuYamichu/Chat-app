const Database = require('../db/actions');

module.exports = async (req, res) => {
  const user = await Database.retriveUserAndServers(req.body.username);
  req.session.user = user.user;
  console.log(req.session);
  res.send(user);
};
