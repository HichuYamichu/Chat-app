import io from 'socket.io-client'
import store from '../store'

export default {
	install(Vue, options) {
		const serverNamespaces = {}

		Vue.prototype.$addServer = function (serverName) {
			serverNamespaces[serverName] = io.connect(`http://localhost:3000/${serverName}`);
			store._mutations.UPDATE_SERVERS[0](serverNamespaces)
		},
		Vue.prototype.$connectServers = function (serverNames) {
			serverNames.forEach(serverName => {
				serverNamespaces[serverName] = io.connect(`http://localhost:3000/${serverName}`);
				store._mutations.UPDATE_SERVERS[0](serverNamespaces)		
			});
		}
	}
}
