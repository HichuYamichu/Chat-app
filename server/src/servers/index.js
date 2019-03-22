module.exports = {
  createServer(serverName) {
    // ADD FOREACH TO INIT ROOMS
    const io = require('../server').io();
    const Database = require('../db/actions');

    io.of(serverName).on('connection', nsp => {
      console.log('connected');
      nsp.join('main');
      nsp.on('messageSend', data => {
        Database.insertMessage(serverName, data.channel, data.message);
        io.of(serverName)
          .in(data.channel)
          .emit('messageRecived', data.message);
      });

      nsp.on('fetchMessages', async data => {
        const messages = await Database.fetchMessages(serverName, data.channel, data.lastMesssageIndex);
        console.log(messages);
        nsp.emit('fetchedMessages', messages);
      });

      nsp.on('init', data => {
        data.forEach(channel => {
          nsp.join(channel);
        });
      });

      nsp.on('createChannel', data => {
        nsp.join(data);
      });
    });
  }
};
