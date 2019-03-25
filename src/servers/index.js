module.exports = {
  createServer(serverName, channelNames) {
    const io = require('../server').io();
    const Database = require('../db/actions');

    io.of(serverName).on('connection', nsp => {
      channelNames.forEach(channelName => {
        nsp.join(channelName);
      });

      nsp.on('messageSend', data => {
        console.log(nsp.handshake.session);
        Database.insertMessage(serverName, data.channel, data.message);
        io.of(serverName)
          .in(data.channel)
          .emit('messageRecived', data.message);
      });

      nsp.on('fetchMessages', async data => {
        const messages = await Database.fetchMessages(
          serverName,
          data.channel,
          data.lastMesssageIndex
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
