module.exports = {
	createServer(io, serverName) {
		io.of(serverName).on('connection', nsp => {
			console.log('connected');
			nsp.on('messageSend', data => {
				console.log(data);
				nsp.emit('messageRecived', data);
			});
		});
	}
};
