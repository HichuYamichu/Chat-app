const socketAuth = (socket, next) => {
  if (socket.handshake.session.user) {
    next();
  } else {
    socket.disconnect();
  }
};

module.exports = socketAuth;
