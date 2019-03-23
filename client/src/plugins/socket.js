import io from 'socket.io-client'

export default {
	install(Vue, options) {
		Vue.$addServer = function (serverName) {
			return io(`localhost:3000/${serverName}`);
		},
		Vue.$destroySockets = function(servers) {
			Object.keys(servers).forEach(server => {
        servers[server].namespace.disconnect()
      })
		}
	}
}
