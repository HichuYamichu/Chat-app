import axios from 'axios'
import Vue from 'vue';

const servers = {
	state: {
		servers: {}
	},
	mutations: {
		UPDATE_SERVERS(state, namespace) {
			state.servers[namespace.nsp.substring(1)] = namespace
			console.log(state.servers);
		},
	},
	actions: { 
		async createServer({ commit }, serverName) {
			try {
				await axios.post("http://localhost:3000/api/servers/new-server", {
					serverName: serverName
				});
				const namespace = Vue.$addServer(serverName);
				commit('UPDATE_SERVERS', namespace);
			} catch (error) {
				throw error
			}
		},
	 },
}

export default servers