const Database = require('../db/actions');
const createServerNamespace = require('../sockets/serverNamespace');
const newServerPolicy = require('../policies/newServerPolicy');
const { ObjectID } = require('mongodb');

module.exports = async (io, sessionMiddleware, socket, serverData) => {
  const err = await newServerPolicy(serverData);
  if (err) throw new Error(err);
  const id = new ObjectID().toString();
  serverData.owner = {
    _id: socket.handshake.session.user._id,
    username: socket.handshake.session.user.username
  };
  if (serverData.icon) {
    serverData.hasIcon = true;
    require('fs').writeFile(`./assets/${id}.jpg`, serverData.icon, err => {
      if (err) console.log(err);
    });
  } else {
    serverData.hasIcon = false;
  }

  const { ops } = await Database.createServer(serverData, id);
  const server = ops[0];

  createServerNamespace(
    io,
    sessionMiddleware,
    server._id,
    server.channels.map(channel => channel._id)
  );
  return server;
};
