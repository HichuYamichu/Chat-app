import io from 'socket.io-client'

export default {
	install(Vue, options) {
		// 1. add global method or property
		Vue.myGlobalMethod = function () {
			// some logic ...
		}

		// 3. inject some component options
		Vue.mixin({
			created: function () {
				const socket = io('http://localhost:3000');
				Vue.prototype.$mainSocket = socket
				Vue.prototype.$serverSockets = []

				Vue.prototype.$addServer = function (serverName) {
					const newServer = io(`http://localhost:3000/${serverName}`);
					Vue.prototype.$serverSockets.push(newServer)
				}
			},

		})

		// 4. add an instance method
		Vue.prototype.$myMethod = function (methodOptions) {
			// some logic ...
		}
	}
}
