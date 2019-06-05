const { ObjectID } = require('mongodb');
const { getDB: db } = require('./index');

module.exports = {
  checkServerNames(serverName) {
    return db()
      .collection('servers')
      .find({ serverName }, { projection: { _id: true } })
      .limit(1)
      .count();
  },
  checkChannelNames(serverID, channelName) {
    return db()
      .collection('servers')
      .find(
        { '_id': serverID, 'channels.channelName': channelName },
        { projection: { _id: true } }
      )
      .limit(1)
      .count();
  },
  async createServer(serverData, serverID) {
    const server = await db().collection('servers').insertOne({
      '_id': serverID,
      'serverName': serverData.serverName,
      'private': serverData.private,
      'icon': serverData.hasIcon,
      'owner': serverData.owner,
      'description': serverData.description,
      'channels': [{ _id: serverID, messages: [], channelName: 'main' }],
      'users': [{ _id: serverData.owner._id, username: serverData.owner.username, active: false }],
      'roles': [
        {
          _id: serverID,
          roleName: 'everyone',
          permissionSets: [{ permissions: { sendMessages: true } }],
          roleMembers: [serverData.owner._id]
        }
      ]
    });
    await db()
      .collection('users')
      .updateOne(
        { _id: serverData.owner._id },
        { $push: { memberOf: server.ops[0]._id } }
      );
    return server;
  },

  leaveServer(serverID, userID) {
    db().collection('users').updateOne({ _id: userID }, { $pull: { memberOf: serverID } });
    return db()
      .collection('servers')
      .findOneAndUpdate(
        { _id: serverID },
        { $pull: { 'roles.$[].roleMembers': userID, 'users': { _id: userID } } },
        { returnOriginal: false }
      );
  },

  deleteServer(serverID) {
    db().collection('users').updateMany({ memberOf: serverID }, { $pull: { memberOf: serverID } });
    db().collection('servers').deleteOne({ _id: serverID });
  },
  addChannel(serverID, channelData) {
    const _id = new ObjectID().toString();
    db().collection('servers').updateOne(
      { _id: serverID },
      { $push: { channels: { _id, channelName: channelData.channelName, messages: [] } } }
    );
    return _id;
  },
  deleteChannel(serverID, channelID) {
    db().collection('servers').updateOne(
      { _id: serverID },
      { $pull: { channels: { _id: channelID } } }
    );
  },
  checkUserNames(userName) {
    return db().collection('users').findOne({ username: userName });
  },
  insertUser(user) {
    return db().collection('users').insertOne(user);
  },
  getPasswordHash(username) {
    return db().collection('users').findOne({ username }, { projection: { password: true } });
  },
  retriveUser(username) {
    return db().collection('users').findOne({ username }, { projection: { password: false } });
  },
  retriveServers(serversID) {
    return db()
      .collection('servers')
      .find({ _id: { $in: serversID } }, { projection: { 'channels.messages': { $slice: -15 } } })
      .toArray();
  },
  retriveServer(serverID) {
    return db()
      .collection('servers')
      .findOne({ _id: serverID }, { projection: { roles: true } });
  },
  getServerNamesAndDesc() {
    return db()
      .collection('servers')
      .aggregate([
        { $project: { serverName: true, description: true } },
        { $sort: { 'roles.0.roleMembers': 1 } },
        { $limit: 10 }
      ])
      .toArray();
  },
  insertMessage(serverID, channelID, message) {
    message._id = new ObjectID().toString();
    db().collection('servers').updateOne(
      {
        _id: serverID,
        channels: { $elemMatch: { _id: channelID } }
      },
      { $push: { 'channels.$.messages': message } }
    );
  },
  fetchMessages(serverID, channelID, lastMesssageTimestamp) {
    return db()
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
  userJoin(serverID, user) {
    db().collection('users').updateOne(
      { _id: user._id },
      { $push: { memberOf: serverID } }
    );
    db().collection('servers').updateOne(
      { _id: serverID },
      { $push: { 'roles.0.roleMembers': user._id, 'users': user } }
    );
  },
  updateUserStatus(serverID, userID, value) {
    return db()
      .collection('servers')
      .findOneAndUpdate(
        { _id: serverID, users: { $elemMatch: { _id: userID } } },
        { $set: { 'users.$.active': value } },
        { returnOriginal: false }
      );
  },
  updateRoles(serverID, roles) {
    db().collection('servers').updateOne({ _id: serverID }, { $set: { roles } });
  },
  addUserToRole(serverID, roleName, username) {
    return db().collection('servers').findOneAndUpdate(
      {
        _id: serverID,
        roles: { $elemMatch: { roleName } }
      },
      { $push: { 'roles.$.roleMembers': username } },
      { projection: { 'roles.$': true }, returnOriginal: false }
    );
  },
  removeUserFromRole(serverID, roleName, username) {
    return db()
      .collection('servers')
      .findOneAndUpdate(
        { _id: serverID, roles: { $elemMatch: { roleName } } },
        { $pull: { 'roles.$.roleMembers': username } },
        { projection: { roles: true }, returnOriginal: false }
      );
  }
};
