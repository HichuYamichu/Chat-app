const MongoDB = require('../db/index');
const db = MongoDB.getDB();

module.exports = {
  checkServerNames(serverName) {
    return db
      .collection('servers')
      .find({ serverName: serverName }, { projection: { _id: true } })
      .limit(1)
      .count();
  },
  checkChannelNames(serverName, channelName) {
    return db
      .collection('servers')
      .find(
        { 'serverName': serverName, 'channels.channelName': channelName },
        { projection: { _id: true } }
      )
      .limit(1)
      .count();
  },
  async createServer(serverData) {
    const server = await db.collection('servers').insertOne({
      'serverName': serverData.serverName,
      'private': serverData.private,
      'owner': serverData.owner,
      'description': serverData.description,
      'channels': [{ messages: [], channelName: 'main' }],
      'roles': [
        {
          roleName: 'everyone',
          disallowedChannels: [],
          permissions: {},
          roleMembers: [serverData.owner]
        }
      ]
    });
    await db
      .collection('users')
      .updateOne({ username: serverData.owner }, { $push: { memberOf: server.ops[0]._id } });
    return server;
  },

  async leaveServer(serverName, username) {
    const { value } = await db
      .collection('servers')
      .findOneAndUpdate(
        { serverName },
        { $pull: { 'roles.$[].roleMembers': username } },
        { projection: { _id: true } }
      );
    await db.collection('users').updateOne({ username }, { $pull: { memberOf: value._id } });
  },

  async deleteServer(serverName) {
    const { _id } = await db
      .collection('servers')
      .findOne({ serverName }, { projection: { _id: true } });
    db.collection('users').updateMany({ memberOf: _id }, { $pull: { memberOf: _id } });
    db.collection('servers').deleteOne({ serverName });
  },
  async addChannel(serverName, channelData) {
    await db
      .collection('servers')
      .updateOne({ serverName: serverName }, { $push: { channels: channelData } });
  },
  deleteChannel(serverName, channelName) {
    db.collection('servers').updateOne({ serverName }, { $pull: { channels: { channelName } } });
  },
  checkUserNames(userName) {
    return db.collection('users').findOne({ username: userName }, { projection: { _id: false } });
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
        { projection: { '_id': false, 'channels.messages': { $slice: -15 } } }
      )
      .toArray();
  },
  getServerNamesAndDesc() {
    return db
      .collection('servers')
      .aggregate([
        { $project: { _id: false, serverName: true, description: true } },
        { $sort: { 'roles.0.roleMembers': 1 } },
        { $limit: 10 }
      ])
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
            'serverName': serverName,
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
            'serverName': { $in: serverList },
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
      .updateOne({ _id: serverID }, { $push: { 'roles.0.roleMembers': username } });
  }
};
