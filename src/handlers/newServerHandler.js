const Servers = require('../socket/index');
const Database = require('../db/actions');

module.exports = (req, res) => {
  console.log(req.body);
  Database.createServer(req.body);
  Servers.createServer(req.body.serverName);
  res.sendStatus(200);
};
