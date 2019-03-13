const { EventEmitter } = require('events');
const ee = new EventEmitter();

module.exports = {
	createServer(serverName, io) {
		io.of(serverName).on('connection', nsp => {
			console.log('connected');
			nsp.on('messageSend', data => {
				console.log(data);
				nsp.emit('messageRecived', data);
			});
		});
	}
};
