const MongoDB = require('../db/index');
const db = MongoDB.getDB();

module.exports = {
	checkServerNames(serverName) {
		return db.collection('servers').findOne({ serverName: serverName });
	},
	checkChannelNames(serverName, channelName) {
		return db.collection('servers').findOne({ serverName: serverName, channels: channelName });
	},
	async createServer(serverData) {
		await db.collection('servers').insertOne(serverData);
	},
	async addChannel(serverName, channelName) {
		await db.collection('servers').updateOne({ serverName: serverName }, { $push: { channels: channelName } });
	},
	checkUserNames(userName) {
		return db.collection('users').findOne({ username: userName });
	},
	insertUser(user) {
		return db.collection('users').insertOne(user);
	},
	async retriveUserAndServers(userObj) {
		const user = await db.collection('users').findOne(userObj);
		const userServers = {};
		for await (const serverID of user.memberOf) {
			const server = await db.collection('servers').findOne(serverID);
			userServers[server.serverName] = server;
		}
		return { user: user, servers: userServers };
	}
};
