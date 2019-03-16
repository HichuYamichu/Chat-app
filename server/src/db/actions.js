const MongoDB = require('../db/index');
const db = MongoDB.getDB();

module.exports = {
	checkServerNames(serverName) {
		return db.collection('servers').findOne({ serverName: serverName });
	},
	async createServer(serverData) {
		await db.collection('servers').insertOne(serverData);
	},
	checkUserNames(userName) {
		return db.collection('users').findOne({ username: userName });
	},
	async insertUser(user) {
		await db.collection('users').insertOne(user);
	},
	retriveUser(user) {
		return db.collection('users').findOne(user);
	}
};
