const Database = require('../db/actions');

module.exports = (req, res) => {
  console.log(req.body);
  Database.addChannel(req.body.serverName, req.body.channelName);
  res.sendStatus(200);
};
