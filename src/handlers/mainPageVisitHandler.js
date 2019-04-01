const Database = require('../db/actions');

module.exports = async (req, res) => {
  const servers = await Database.getServerNamesAndDesc();
  res.send(servers);
};
