module.exports = {
	checkServerNames(db, serverName) {
		return db.collection('servers').findOne({ serverName: serverName });
	},
	async createServer(db, serverData) {
		await db.collection('servers').insertOne(serverData);
	},
	checkUserNames(db, userName) {
		return db.collection('users').findOne({ userName: userName });
	},
	async insertUser(db, user) {
		await db.collection('users').insertOne(user);
	},
	retriveUser(db, user) {
		return db.collection('users').findOne(user);
	}
};
