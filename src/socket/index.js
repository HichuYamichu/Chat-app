module.exports = {
  createServer(serverName, channelNames) {
    const Database = require('../db/actions');
    const io = require('../server').io();
    const sharedsession = require('express-socket.io-session');
    const sessionConfig = require('../sessionConfig');

    const sessionMiddleware = sessionConfig.getSession();
    io.of(serverName).use(
      sharedsession(sessionMiddleware, {
        autoSave: true
      })
    );

    io.of(serverName).activeUsers = [];

    io.of(serverName).on('connection', socket => {
      if (
        !socket.handshake.session ||
        !socket.handshake.session.user ||
        !socket.handshake.session.user.accessList ||
        !socket.handshake.session.user.accessList.some(
          serverAcces => serverAcces.serverName === serverName
        )
      ) {
        return socket.disconnect();
      }

      channelNames.forEach(channelName => {
        if (
          socket.handshake.session.user.accessList
            .find(serverAcces => serverAcces.serverName === serverName)
            .disallowedChannels.includes(channelName)
        ) {
          return;
        }
        socket.join(channelName);
      });

      socket.user = { username: socket.handshake.session.user.username };
      io.of(serverName).activeUsers.push(socket.user);
      io.of(serverName).emit('updateActiveUsers', io.of(serverName).activeUsers);

      socket.on('init', data => {
        data.forEach(channel => {
          socket.join(channel);
        });
      });

      socket.on('disconnect', () => {
        io.of(serverName).activeUsers = io
          .of(serverName)
          .activeUsers.filter(user => user !== socket.user);
        io.of(serverName).emit('updateActiveUsers', io.of(serverName).activeUsers);
      });

      socket.on('logout', () => socket.disconnect());

      socket.on('leaveServer', () => {
        Database.leaveServer(serverName, socket.user.username);
        socket.disconnect();
        socket.handshake.session.user.accessList = socket.handshake.session.user.accessList.filter(
          accessListEntry => accessListEntry.serverName !== serverName
        );
      });

      socket.on('deleteServer', () => {
        Database.deleteServer(serverName);
        io.of(serverName).emit('serverDelete', serverName);
        Object.keys(io.of(serverName).sockets).forEach(connectedSocket => {
          io.of(serverName).sockets[connectedSocket].handshake.session.user.accessList = io
            .of(serverName)
            .sockets[connectedSocket].handshake.session.user.accessList.filter(
              accessListEntry => accessListEntry.serverName !== serverName
            );
          io.of(serverName).sockets[connectedSocket].disconnect();
        });
        delete io.nsps[`/${serverName}`];
      });

      socket.on('messageSend', data => {
        console.log(socket.handshake.session.user);
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
        const exists = await Database.checkChannelNames(serverName, channelName);
        if (exists) {
          Database.deleteChannel(serverName, channelName);
          Object.keys(io.of(serverName).sockets).forEach(connectedSocket => {
            io
              .of(serverName)
              .sockets[connectedSocket].handshake.session.user.accessList.find(
                accessListEntry => accessListEntry.serverName === serverName
              ).disallowedChannels = io
                .of(serverName)
                .sockets[connectedSocket].handshake.session.user.accessList.find(
                  accessListEntry => accessListEntry.serverName === serverName
                )
                .disallowedChannels.filter(channel => channel.channelName !== channelName);
            io.of(serverName).sockets[connectedSocket].leave(channelName);
          });
          io.of(serverName).emit('channelDeleted', channelName);
        }
      });
    });
  }
};
