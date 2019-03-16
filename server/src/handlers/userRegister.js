const Database = require('../db/actions');

module.exports = (req, res) => {
	Database.insertUser(req.body);
	res.sendStatus(200);
};
