module.exports = serverID => (socket, next) => {
  socket.on('logout', () => socket.disconnect());
  next();
};
