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
  createServer(serverData) {
    return db.collection('servers').insertOne({
      'serverName': serverData.serverName,
      'public': true,
      'owner': serverData.owner,
      'channels': [{ messages: [], channelName: 'main' }],
      'roles': [
        {
          channelName: 'default',
          disallowedChannels: [],
          permissions: {},
          roleMembers: [serverData.owner]
        }
      ]
    });
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
  getPasswordHash(username) {
    return db
      .collection('users')
      .findOne({ username }, { projection: { _id: false, password: true } });
  },
  retriveUser(username) {
    return db
      .collection('users')
      .findOne({ username }, { projection: { _id: false, password: false } });
  },
  retriveServers(serversID) {
    return db
      .collection('servers')
      .find(
        { _id: { $in: serversID } },
        { projection: { _id: false, 'channels.messages': { $slice: -15 } } }
      )
      .toArray();
  },
  getServerNamesAndDesc() {
    return db
      .collection('servers')
      .find(
        { public: true },
        { projection: { _id: false, serverName: true, description: true } }
      )
      .toArray();
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
  fetchMessages(serverName, channelName, lastMesssageTimestamp) {
    return db
      .collection('servers')
      .aggregate([
        { $unwind: '$channels' },
        { $unwind: '$channels.messages' },
        {
          $match: {
            serverName: serverName,
            'channels.channelName': channelName,
            'channels.messages.timestamp': { $gt: lastMesssageTimestamp }
          }
        },
        { $project: { _id: false } },
        { $replaceRoot: { newRoot: '$channels.messages' } },
        { $limit: 15 }
      ])
      .toArray();
  },
  getAccessList(username, serverList) {
    return db
      .collection('servers')
      .aggregate([
        { $unwind: '$roles' },
        { $unwind: '$roles.roleMembers' },
        {
          $match: {
            serverName: { $in: serverList },
            'roles.roleMembers': username
          }
        },
        { $project: { _id: false, roles: true, serverName: true } }
      ])
      .toArray();
  },
  getServerID(serverName) {
    return db.collection('servers').findOne({ serverName });
  },
  async userJoin(serverID, username) {
    await db
      .collection('users')
      .updateOne({ username: username }, { $push: { memberOf: serverID } });
    await db
      .collection('servers')
      .updateOne(
        { _id: serverID },
        { $push: { 'roles.0.roleMembers': username } }
      );
  }
};
