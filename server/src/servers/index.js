module.exports = {
	createServer(io, socket, data) {
		socket.on('connection', childSocket => {
			console.log('someone connected');
			io.sockets.emit('name', 'sdda');
		});
	}
};
