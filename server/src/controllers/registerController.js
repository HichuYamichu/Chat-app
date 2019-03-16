const Database = require('../db/actions');

module.exports = async (req, res) => {
	const isTaken = await Database.checkUserNames(req.body.username);
	if (isTaken) return res.status(500).send({ error: 'Username already taken' });
};


