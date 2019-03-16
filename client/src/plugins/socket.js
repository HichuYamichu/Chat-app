import io from 'socket.io-client'

export default {
	install(Vue, options) {
		Vue.$addServer = function (serverName) {
			return io(`localhost:3000/${serverName}`);
		}
	}
}
