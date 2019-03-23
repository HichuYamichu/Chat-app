const Database = require('../db/actions');

module.exports = async (req, res) => {
  const user = await Database.retriveUserAndServers(req.body.username);
  res.send(user);
};
