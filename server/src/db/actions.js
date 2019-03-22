const MongoDB = require('../db/index');
const db = MongoDB.getDB();

module.exports = {
  checkServerNames(serverName) {
    return db
      .collection('servers')
      .findOne({ serverName: serverName }, { projection: { _id: false } });
  },
  checkChannelNames(serverName, channelName) {
    return db
      .collection('servers')
      .findOne(
        { serverName: serverName, channels: channelName },
        { projection: { _id: false } }
      );
  },
  async createServer(serverData) {
    await db.collection('servers').insertOne(serverData);
  },
  async addChannel(serverName, channelName) {
    await db
      .collection('servers')
      .updateOne(
        { serverName: serverName },
        { $push: { channels: channelName } }
      );
  },
  checkUserNames(userName) {
    return db
      .collection('users')
      .findOne({ username: userName }, { projection: { _id: false } });
  },
  insertUser(user) {
    return db.collection('users').insertOne(user);
  },
  async retriveUserAndServers(userObj) {
    const user = await db
      .collection('users')
      .findOne(userObj, { projection: { _id: false } });
    const userServers = {};
    const servers = await db
      .collection('servers')
      .find(
        { _id: { $in: user.memberOf } },
        { projection: { _id: false, 'channels.messages': { $slice: -15 } } }
      )
      .toArray();
    servers.forEach(server => {
      userServers[server.serverName] = server;
    });
    return { user: user, servers: userServers };
  },
  async insertMessage(serverName, channelName, message) {
    await db.collection('servers').updateOne(
      {
        serverName: serverName,
        channels: { $elemMatch: { channelName: channelName } }
      },
      { $push: { 'channels.$.messages': message } }
    );
  },
  fetchMessages(serverName, channelName, lastMesssageIndex) {
    console.log(lastMesssageIndex);
    return db.collection('servers').findOne(
      {
        serverName: serverName,
        channels: { $elemMatch: { channelName: channelName } }
      },
      { projection: { _id: false, 'channels.0.messages.$[]': true } }
    );
  }
};
