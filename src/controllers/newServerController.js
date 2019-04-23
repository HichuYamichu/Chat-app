const Database = require('../db/actions');
const createServerNamespace = require('../sockets/serverNamespace');
const newServerPolicy = require('../policies/newServerPolicy');

module.exports = async (io, sessionMiddleware, socket, serverData) => {
  const err = await newServerPolicy(serverData);
  if (err) throw new Error(err);
  serverData.owner = socket.handshake.session.user.username;
  const { ops } = await Database.createServer(serverData);
  const server = ops[0];
  server.users = [
    ...server.roles[0].roleMembers.map(member => ({ username: member, active: false }))
  ];
  createServerNamespace(
    io,
    sessionMiddleware,
    server.serverName,
    server.channels.map(channel => channel.channelName),
    [{ username: server.owner, active: false }]
  );
  return server;
};
