const Servers = require('../socket/index');
const Database = require('../db/actions');

module.exports = async (req, res) => {
  const server = await Database.createServer(req.body);
  Servers.createServer(req.body.serverName, req.body.channels.map(channel => channel.channelName));
  res.send(server.ops[0]);
};
