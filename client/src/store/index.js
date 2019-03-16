import Vue from 'vue';
import Vuex from 'vuex';
import user from './user'
import servers from './servers'


Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		user,
		servers
	}
})

// export default new Vuex.Store({
// 	state: {
// 		servers: {},
// 		user: null
// 	},

// 	getters: {
// 		userServers: state => state.user.memberOf
// 	},

// 	mutations: {
// 		UPDATE_SERVERS(state, namespace) {
// 			state.servers[namespace.nsp.substring(1)] = namespace
// 			console.log(state.servers);
// 		},
// 		SET_USER(state, user) {
// 			state.user = user
// 		}
// 	},
// 	actions: {
// 		async createServer({ commit }, serverName) {
// 			try {
// 				await axios.post("http://localhost:3000/api/servers/new-server", {
// 					serverName: serverName
// 				});
// 				const namespace = Vue.$addServer(serverName);
// 				commit('UPDATE_SERVERS', namespace);
// 			} catch (error) {
// 				throw error
// 			}
// 		},
// 		async register({ commit }, credentials) {
// 			const user = await axios.post('http://localhost:3000/api/users/register', { username: credentials.username, password: credentials.password, memberOf: [] })
// 			commit('SET_USER', user.data);

// 		},
// 		async login({ commit }, credentials) {
// 			const user = await axios.post('http://localhost:3000/api/users/login', { username: credentials.username, password: credentials.password })		
// 			user.data.memberOf.forEach(serv => console.log(serv));
// 			user.data.memberOf.forEach(addServer => {
// 				const namespace = Vue.$addServer(addServer)
// 				commit('UPDATE_SERVERS', namespace);
// 			});
// 			commit('SET_USER', user.data);
// 		}
// 	}
// })