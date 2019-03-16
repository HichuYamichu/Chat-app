const Servers = require('../servers/index');
const Database = require('../db/actions');

module.exports = (req, res) => {
	Database.createServer(req.body);
	Servers.createServer(req.body.serverName);
	res.sendStatus(200);
};
