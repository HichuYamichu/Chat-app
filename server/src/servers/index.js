module.exports = {
	createServer(serverName) {
		const io = require('../server').io();

		io.of(serverName).on('connection', nsp => {
			console.log('connected');
			nsp.on('messageSend', data => {
				io.of(serverName).emit('messageRecived', data);
			});
		});
	}
};
