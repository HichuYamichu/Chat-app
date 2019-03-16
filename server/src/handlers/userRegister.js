const Database = require('../db/actions');

module.exports = async (req, res) => {
	const user = await Database.insertUser(req.body);
	res.send(user.ops[0]);
};
