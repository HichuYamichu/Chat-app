module.exports = serverName => (socket, next) => {
  socket.on('logout', () => socket.disconnect());
  next();
};
