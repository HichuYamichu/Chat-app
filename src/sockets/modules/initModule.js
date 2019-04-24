module.exports = serverName => (socket, next) => {
  socket.on('init', data => {
    data.forEach(channel => {
      socket.join(channel);
    });
  });
  next();
};
