import io from 'socket.io-client'
import store from '../store'

export default {
	install(Vue, options) {
		Vue.prototype.$addServer = function (serverName) {
			store._mutations.UPDATE_SERVERS[0](io(`localhost:3000/${serverName}`))
		},
		Vue.prototype.$connectServers = function (serverNames) {
			serverNames.forEach(serverName => {
				store._mutations.UPDATE_SERVERS[0](io(`http://localhost:3000/${serverName}`))
			});
		}
	}
}
