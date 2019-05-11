module.exports = serverID => (socket, next) => {
  socket.on('init', data => {
    data.forEach(channel => {
      socket.join(channel);
    });
  });
  next();
};
