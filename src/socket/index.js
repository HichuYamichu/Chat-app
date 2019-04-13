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
        ) { return; }
        socket.join(channelName);
      });

      socket.user = { username: socket.handshake.session.user.username };
      io.of(serverName).activeUsers.push(socket.user);
      io.of(serverName).emit(
        'updateActiveUsers',
        io.of(serverName).activeUsers
      );

      socket.on('disconnect', () => {
        io.of(serverName).activeUsers = io
          .of(serverName)
          .activeUsers.filter(user => user !== socket.user);
        io.of(serverName).emit(
          'updateActiveUsers',
          io.of(serverName).activeUsers
        );
      });

      socket.on('leaveServer', () => {
        Database.leaveServer(serverName, socket.user.username);
        socket.disconnect();
        socket.handshake.session.user.accessList = socket.handshake.session.user.accessList.filter(
          accessListEntry => accessListEntry.serverName !== serverName
        );
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
        socket.emit('fetchedMessages', messages);
      });

      socket.on('init', data => {
        data.forEach(channel => {
          socket.join(channel);
        });
      });

      socket.on('createChannel', data => {
        console.log(data);
        socket.join(data);
      });
    });
  }
};
