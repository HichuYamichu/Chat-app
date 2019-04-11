module.exports = {
  createServer(serverName, channelNames) {
    const Database = require('../db/actions');
    const io = require('../server').io();
    const sharedsession = require('express-socket.io-session');
    const sessionConfig = require('../sessionConfig');

    const sessionMiddleware = sessionConfig.getSession();
    io.of(serverName).use(sharedsession(sessionMiddleware, {
      autoSave: true
    }));

    io.of(serverName).on('connection', nsp => {
      if (
        !nsp.handshake.session ||
        !nsp.handshake.session.user ||
        !nsp.handshake.session.user.accessList ||
        !nsp.handshake.session.user.accessList.some(serverAcces => serverAcces.serverName === serverName)
      ) return nsp.disconnect();
      const accessListEntry = nsp.handshake.session.user.accessList.find(serverAcces => serverAcces.serverName === serverName);
      channelNames.forEach(channelName => {
        if (accessListEntry.disallowedChannels.includes(channelName)) return;
        nsp.join(channelName);
      });

      nsp.on('messageSend', data => {
        Database.insertMessage(serverName, data.channel, data.message);
        io.of(serverName)
          .in(data.channel)
          .emit('messageRecived', data);
      });

      nsp.on('fetchMessages', async data => {
        const messages = await Database.fetchMessages(
          serverName,
          data.channel,
          data.lastMesssageTimestamp
        );
        nsp.emit('fetchedMessages', messages);
      });

      nsp.on('init', data => {
        data.forEach(channel => {
          nsp.join(channel);
        });
      });

      nsp.on('createChannel', data => {
        console.log(data);
        nsp.join(data);
      });
    });
  }
};
