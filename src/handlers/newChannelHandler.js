const Database = require('../db/actions');

module.exports = (req, res) => {
  Database.addChannel(req.body.serverName, req.body.channelName);
  res.sendStatus(200);
};
