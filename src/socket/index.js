module.exports = {
  createServer(serverName, channelNames) {
    const Database = require('../db/actions');
    const sessionMiddleware = require('../sessionConfig').getSession();
    const io = require('../server').io();

    io.use((socket, next) => {
      sessionMiddleware(socket.request, {}, next);
    });

    io.of(serverName).on('connection', nsp => {
      if (
        !nsp.request.session ||
        !nsp.request.session.user ||
        !nsp.request.session.user.accessList ||
        !nsp.request.session.user.accessList.some(serverAcces => serverAcces.serverName === serverName)
      ) return nsp.disconnect();
      const accessListEntry = nsp.request.session.user.accessList.find(serverAcces => serverAcces.serverName === serverName);
      channelNames.forEach(channelName => {
        if (accessListEntry.disallowedChannels.includes(channelName)) return;
        nsp.join(channelName);
      });

      nsp.on('messageSend', data => {
        Database.insertMessage(serverName, data.channel, data.message);
        io.of(serverName)
          .in(data.channel)
          .emit('messageRecived', data.message);
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
