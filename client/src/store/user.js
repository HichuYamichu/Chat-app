import axios from 'axios'
import Vue from 'vue';


const user = {
	state: {
		user: null
	},

	mutations: {
		SET_USER(state, user) {
			state.user = user
		}
	},
	actions: {
		async register({ commit }, credentials) {
			const user = await axios.post('http://localhost:3000/api/users/register', { username: credentials.username, password: credentials.password, memberOf: [] })
			commit('SET_USER', user.data);

		},
		async login({ commit }, credentials) {
			const user = await axios.post('http://localhost:3000/api/users/login', { username: credentials.username, password: credentials.password })
			user.data.memberOf.forEach(serv => console.log(serv));
			user.data.memberOf.forEach(addServer => {
				const namespace = Vue.$addServer(addServer)
				commit('UPDATE_SERVERS', namespace, { root: true });
			});
			commit('SET_USER', user.data);
		}
	},
	getters: { 
		userServers: state => state.user.memberOf,
		user: state => state.user
	 }
}

export default user