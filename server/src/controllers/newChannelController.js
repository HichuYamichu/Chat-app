const Database = require('../db/actions');

module.exports = async (req, res) => {
	const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	if (format.test(req.body.serverName)) {
		return { error: 'Illegal character in channel name!' };
	}
	const isTaken = await Database.checkChannelNames(req.body.serverName, req.body.channelName);
	if (isTaken) {
		return { error: 'Name already taken' };
	}
};
