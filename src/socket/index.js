module.exports = {
  createServer(io, serverName, channelNames) {
    const sessionMiddleware = require('../sessionConfig').getSession();
    const Database = require('../db/actions');

    io.use((socket, next) => {
      sessionMiddleware(socket.request, {}, next);
    });

    io.of(serverName).on('connection', nsp => {
      console.log(nsp.request.session);
      if (!nsp.request.session.user.memberOf.includes(serverName)) return nsp.disconnect();
      channelNames.forEach(channelName => {
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
