const Database = require('../db/actions');

module.exports = async (req, res) => {
	console.log(req.body);
	const user = await Database.retriveUser(req.body);
	console.log(user);
	res.send(user);
};
