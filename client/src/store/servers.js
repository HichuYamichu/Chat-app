import axios from 'axios';
import Vue from 'vue';

const servers = {
  state: {
    servers: {}
  },
  mutations: {
    UPDATE_SERVERSOCKETS(state, server) {
      state.servers[server.serverName] = server
    },
    SET_SERVERS(state, servers) {
      state.servers = servers;
    },
    CHANGE_ACTIVECHANNEL(state, payload) {
      state.servers[payload.serverName].activeChannel = payload.channelName;
    },
    ADD_MESSAGE(state, payload) {
      state.servers[payload.serverName].channels
    }
  },
  actions: {
    async createServer({ commit, rootState }, serverName) {
      try {
        await axios.post('http://localhost:3000/api/servers/new-server', {
          serverName: serverName,
					owner: rootState.user.user.username,
					channels: [{ messages: [], channelName: 'main' }]
        });
				const namespace = Vue.$addServer(serverName);
				const server = {
					serverName: serverName,
					owner: rootState.user.user.username,
          channels: [{ messages: [], channelName: 'main' }],
          activeChannel: 'main',
					namespace: namespace
				}
        commit('UPDATE_SERVERSOCKETS', server);
      } catch (error) {
        throw error;
      }
    },
    async handleLogin({ commit }, servers) {
      Object.keys(servers).forEach(server => {
        servers[server].namespace = Vue.$addServer(server)
        servers[server].activeChannel = 'main'
      })
      commit('SET_SERVERS', servers)
    }
  },
  getters: {
    servers: state => state.servers,
    activeServer: state => serverName => state.servers[serverName]
  }
};

export default servers;
