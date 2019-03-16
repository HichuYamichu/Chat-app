module.exports = {
	createServer(serverName) {
		const io = require('../server').io();

		io.of(serverName).on('connection', nsp => {
			console.log('connected');
			nsp.on('messageSend', data => {
				console.log(data);
				nsp.emit('messageRecived', data);
			});
		});
	}
};
