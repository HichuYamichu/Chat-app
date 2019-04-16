const Database = require('../db/actions');
const sharedsession = require('express-socket.io-session');
const serverAuthMiddleware = require('../middleware/serverAuth');

module.exports = (io, sessionMiddleware, serverName, channelNames) => {
  io.of(serverName).use(
    sharedsession(sessionMiddleware, {
      autoSave: true
    })
  );

  io.of(serverName).use(serverAuthMiddleware(serverName, channelNames));

  io.of(serverName).activeUsers = [];

  io.of(serverName).on('connection', socket => {
    console.log(`connected to ${serverName}`);
    io.of(serverName).activeUsers.push({ username: socket.user.username });
    io.of(serverName).emit('updateActiveUsers', io.of(serverName).activeUsers);

    socket.on('init', data => {
      data.forEach(channel => {
        socket.join(channel);
      });
    });

    socket.on('disconnect', () => {
      console.log(`disconnected from ${serverName}`);
      io.of(serverName).activeUsers = io.of(serverName).activeUsers.filter(user => user.username !== socket.user.username);
      io.of(serverName).emit('updateActiveUsers', io.of(serverName).activeUsers);
    });

    socket.on('logout', () => socket.disconnect());

    socket.on('leaveServer', () => {
      Database.leaveServer(
        serverName,
        { username: socket.user.username }.username
      );
      socket.disconnect();
    });

    socket.on('deleteServer', () => {
      Database.deleteServer(serverName);
      io.of(serverName).emit('serverDelete', serverName);
      Object.keys(io.of(serverName).sockets).forEach(connectedSocket => {
        io.of(serverName).sockets[connectedSocket].disconnect();
      });
      delete io.nsps[`/${serverName}`];
    });

    socket.on('messageSend', data => {
      Database.insertMessage(serverName, data.channel, data.message);
      io.of(serverName)
        .in(data.channel)
        .emit('messageRecived', data);
    });

    socket.on('fetchMessages', async data => {
      const messages = await Database.fetchMessages(
        serverName,
        data.channel,
        data.lastMesssageTimestamp
      );
      socket.emit('updateMessages', { messages, channelName: data.channel });
    });

    socket.on('createChannel', async data => {
      const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (format.test(data)) {
        return socket.emit('errorOccured', 'Illegal character in channel name!');
      }
      const taken = await Database.checkChannelNames(serverName, data);
      if (taken) {
        return socket.emit('errorOccured', 'Channel name taken');
      }
      Object.keys(io.of(serverName).sockets).forEach(connectedSocket =>
        io.of(serverName).sockets[connectedSocket].join(data));

      const channel = { channelName: data, messages: [] };
      Database.addChannel(serverName, channel);
      io.of(serverName).emit('addChannel', channel);
    });

    socket.on('deleteChannel', async channelName => {
      console.log(channelName);
      if (channelName === 'main') {
        return socket.emit('errorOccured', 'You can not delete main channel');
      }
      const exists = await Database.checkChannelNames(serverName, channelName);
      if (exists) {
        Database.deleteChannel(serverName, channelName);
        Object.keys(io.of(serverName).sockets).forEach(connectedSocket => {
          io.of(serverName).sockets[connectedSocket].leave(channelName);
        });
        io.of(serverName).emit('channelDeleted', channelName);
      } else {
        socket.emit('errorOccured', 'There is no channel with that name');
      }
    });
  });
};
