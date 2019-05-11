const { ObjectID } = require('mongodb');
let db;

module.exports = {
  prepareQueries(_db) {
    db = _db;
  },
  checkServerNames(serverName) {
    return db
      .collection('servers')
      .find({ serverName }, { projection: { _id: true } })
      .limit(1)
      .count();
  },
  checkChannelNames(serverID, channelName) {
    return db
      .collection('servers')
      .find(
        { '_id': serverID, 'channels.channelName': channelName },
        { projection: { _id: true } }
      )
      .limit(1)
      .count();
  },
  async createServer(serverData, id) {
    const server = await db.collection('servers').insertOne({
      '_id': id,
      'serverName': serverData.serverName,
      'private': serverData.private,
      'icon': serverData.hasIcon,
      'owner': serverData.owner,
      'description': serverData.description,
      'channels': [{ _id: new ObjectID(), messages: [], channelName: 'main' }],
      'roles': [
        {
          _id: id,
          roleName: 'everyone',
          disallowedChannels: [],
          permissions: { sendMessages: true },
          roleMembers: [serverData.owner]
        }
      ]
    });
    await db
      .collection('users')
      .updateOne({ username: serverData.owner }, { $push: { memberOf: server.ops[0]._id } });
    return server;
  },

  async leaveServer(serverID, username) {
    const {
      value: { _id }
    } = await db
      .collection('servers')
      .findOneAndUpdate(
        { _id: serverID },
        { $pull: { 'roles.$[].roleMembers': username } },
        { projection: { _id: true } }
      );
    await db.collection('users').updateOne({ username }, { $pull: { memberOf: _id } });
  },

  async deleteServer(serverID) {
    // const { _id } = await db
    //   .collection('servers')
    //   .findOne({ _id: serverID }, { projection: { _id: true } });
    db.collection('users').updateMany({ memberOf: serverID }, { $pull: { memberOf: serverID } });
    db.collection('servers').deleteOne({ _id: serverID });
  },
  addChannel(serverID, channelData) {
    const _id = new ObjectID();
    db
      .collection('servers')
      .updateOne(
        { _id: serverID },
        { $push: { channels: { _id, channelName: channelData.channelName, messages: [] } } }
      );
    return _id;
  },
  deleteChannel(serverID, channelID) {
    db.collection('servers').updateOne({ _id: serverID }, { $pull: { channels: { _id: new ObjectID(channelID) } } });
  },
  checkUserNames(userName) {
    return db.collection('users').findOne({ username: userName });
  },
  insertUser(user) {
    return db.collection('users').insertOne(user);
  },
  getPasswordHash(username) {
    return db.collection('users').findOne({ username }, { projection: { password: true } });
  },
  retriveUser(username) {
    return db.collection('users').findOne({ username }, { projection: { password: false } });
  },
  retriveServers(serversID) {
    return db
      .collection('servers')
      .find({ _id: { $in: serversID } }, { projection: { 'channels.messages': { $slice: -15 } } })
      .toArray();
  },
  retriveServer(serverID) {
    return db.collection('servers').findOne({ _id: serverID }, { projection: { roles: true } });
  },
  getServerNamesAndDesc() {
    return db
      .collection('servers')
      .aggregate([
        { $project: { serverName: true, description: true } },
        { $sort: { 'roles.0.roleMembers': 1 } },
        { $limit: 10 }
      ])
      .toArray();
  },
  insertMessage(serverID, channelID, message) {
    message._id = new ObjectID();
    db.collection('servers').updateOne(
      {
        _id: serverID,
        channels: { $elemMatch: { _id: new ObjectID(channelID) } }
      },
      { $push: { 'channels.$.messages': message } }
    );
  },
  fetchMessages(serverID, channelID, lastMesssageTimestamp) {
    return db
      .collection('servers')
      .aggregate([
        { $unwind: '$channels' },
        { $unwind: '$channels.messages' },
        {
          $match: {
            '_id': serverID,
            'channels._id': channelID,
            'channels.messages.timestamp': { $gt: lastMesssageTimestamp }
          }
        },
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
        { $project: { roles: true, serverName: true } }
      ])
      .toArray();
  },
  // getServerID(serverName) {
  //   return db.collection('servers').findOne({ serverName });
  // },
  async userJoin(serverID, username) {
    await db
      .collection('users')
      .updateOne({ username: username }, { $push: { memberOf: serverID } });
    await db
      .collection('servers')
      .updateOne({ _id: serverID }, { $push: { 'roles.0.roleMembers': username } });
  },
  updateRoles(serverID, roles) {
    db.collection('servers').updateOne({ _id: serverID }, { $set: { roles } });
  },
  addUserToRole(serverID, roleName, username) {
    return db.collection('servers').findOneAndUpdate(
      {
        _id: serverID,
        roles: { $elemMatch: { roleName } }
      },
      { $push: { 'roles.$.roleMembers': username } },
      { projection: { 'roles.$': true }, returnNewDocument: true }
    );
  },
  removeUserFromRole(serverID, roleName, username) {
    return db
      .collection('servers')
      .findOneAndUpdate(
        { _id: serverID, roles: { $elemMatch: { roleName } } },
        { $pull: { 'roles.$.roleMembers': username } },
        { projection: { roles: true }, returnNewDocument: true }
      );
  }
};
