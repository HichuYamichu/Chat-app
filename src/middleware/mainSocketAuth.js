module.exports = (socket, next) => {
  if (socket.handshake.session.user) {
    next();
  } else {
    socket.disconnect();
    next();
  }
};
