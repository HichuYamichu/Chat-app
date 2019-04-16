const Database = require('../db/actions');
const createServerNamespace = require('../sockets/serverNamespace');
const newServerPolicy = require('../policies/newServerPolicy');

module.exports = async (io, sessionMiddleware, socket, serverData) => {
  const err = await newServerPolicy(serverData);
  if (err) throw new Error({ err });
  serverData.owner = socket.handshake.session.user.username;
  const { ops } = await Database.createServer(serverData);
  const server = ops[0];
  createServerNamespace(io, sessionMiddleware, server.serverName, server.channels.map(channel => channel.channelName));
  // server.roles.forEach(role => {
  //   if (role.roleMembers.some(member => member === socket.handshake.session.user.username)) {
  //     server.channels.filter(channel => !role.disallowedChannels.includes(channel.channelName));
  //     role.serverName = server.serverName;
  //     socket.handshake.session.user.accessList.push({
  //       roleName: role.roleName,
  //       disallowedChannels: role.disallowedChannels,
  //       permissions: role.permissions,
  //       serverName: server.serverName
  //     });
  //   }
  // });
  return server;
};
