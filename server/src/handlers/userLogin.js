const Database = require('../db/actions');

module.exports = async (req, res) => {
	console.log(req.body);
	const user = await Database.retriveUserAndServers(req.body);
	res.send(user);
};
