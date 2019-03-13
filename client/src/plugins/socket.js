import io from 'socket.io-client'
import store from '../store'

export default {
	install(Vue, options) {
		const servers = {}

		Vue.mixin({
			created: function () {
				// Vue.prototype.$mainSocket = socket
				// Vue.prototype.$serverSockets = []
			},

		})

		Vue.prototype.$addServer = function (serverName) {
			servers[serverName] = io.connect(`http://localhost:3000/${serverName}`);
			addListeners(serverName)
		}

		Vue.prototype.$sendMessage = function (data) {
			servers['lolxD'].emit('messageSend', data)
		}

		function addListeners(serverName) {
			servers[serverName].on('connect', data => {
				console.log('connected')
			})

			servers[serverName].on('messageRecived', data => {
				console.log(data)
			})
		}
		// Vue.myGlobalMethod = function () {}
	}
}
