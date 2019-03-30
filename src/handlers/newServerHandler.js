const Servers = require('../socket/index');
const Database = require('../db/actions');

module.exports = (req, res) => {
  console.log(req.body);
  Database.createServer(req.body);
  Servers.createServer(req.body.serverName, req.body.channels.map(channel => channel.channelName));
  res.sendStatus(200);
};
