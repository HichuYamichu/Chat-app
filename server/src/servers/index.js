module.exports = {
  createServer(serverName) {
    const io = require('../server').io();

    io.of(serverName).on('connection', nsp => {
      console.log('connected');
      nsp.join('main');
      nsp.on('messageSend', data => {
        io.of(serverName)
          .in(data.channel)
          .emit('messageRecived', data.message);
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
