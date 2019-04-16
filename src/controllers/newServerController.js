const Database = require('../db/actions');
const createServerNamespace = require('../sockets/serverNamespace');
const newServerPolicy = require('../policies/newServerPolicy');

module.exports = async (io, sessionMiddleware, socket, serverData) => {
  const err = await newServerPolicy(serverData);
  if (err) throw new Error(err);
  serverData.owner = socket.handshake.session.user.username;
  const { ops } = await Database.createServer(serverData);
  const server = ops[0];
  createServerNamespace(io, sessionMiddleware, server.serverName, server.channels.map(channel => channel.channelName));
  return server;
};
