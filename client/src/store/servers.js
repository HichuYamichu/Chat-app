import axios from 'axios';
import Vue from 'vue';

const servers = {
  state: {
    servers: {}
  },
  mutations: {
    UPDATE_SERVERS(state, server) {
      state.servers[server.serverName] = server;
    },
    SET_SERVERS(state, servers) {
      state.servers = servers;
    },
    CLEAR_SERVERS(state) {
      state.servers = {}
    },
    CHANGE_ACTIVECHANNEL(state, payload) {
      state.servers[payload.serverName].activeChannel = payload.channelName;
    },
    MESSAGE_RECIVED(state, payload) {
      payload.channel.messages.push(payload.message);
    },
    APPEND_MESSAGES(state, payload) {
      payload.channel.messages.unshift(...payload.messages)
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
        };
        commit('UPDATE_SERVERS', server);
      } catch (error) {
        throw error;
      }
    },
    async handleLogin({ commit, dispatch }, servers) {
      Object.keys(servers).forEach(server => {
        servers[server].namespace = Vue.$addServer(server);
        servers[server].activeChannel = 'main';
        servers[server].namespace.emit(
          'init',
          servers[server].channels.map(channel => channel.channelName)
        );

        servers[server].namespace.on('messageRecived', data => {
          dispatch('messageRecived', { serverName: server, message: data });
        });

        servers[server].namespace.on('fetchedMessages', data => {
          dispatch('fetchedMessages', { serverName: server, messages: data });
        });
      });
      commit('SET_SERVERS', servers);
    },
    messageRecived({ commit, getters }, payload) {
      const channel = getters.activeChannel(payload.serverName);
      commit('MESSAGE_RECIVED', { channel, message: payload.message });
    },
    fetchedMessages({ commit, getters }, payload) {
      const channel = getters.activeChannel(payload.serverName);
      commit('APPEND_MESSAGES', { channel, messages: payload.messages });
    },
    disconnectSockets({ commit, getters }) {
      Vue.$destroySockets(getters.servers)
      commit('CLEAR_SERVERS')
    }
  },
  getters: {
    servers: state => state.servers,
    activeServer: state => serverName => state.servers[serverName],
    activeChannel: state => serverName =>
      state.servers[serverName].channels.find(
        channel =>
          channel.channelName === state.servers[serverName].activeChannel
      )
  }
};

export default servers;
