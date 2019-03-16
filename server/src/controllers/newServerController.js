const Database = require('../db/actions');

module.exports = async (req, res) => {
	const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	if (format.test(req.body.serverName)) return res.status(500).send({ error: 'Illegal character in server name!' });
	const isTaken = await Database.checkServerNames(req.body.serverName);
	if (isTaken) return res.status(500).send({ error: 'Name already taken' });
};
