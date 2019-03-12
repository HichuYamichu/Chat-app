import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isConnected: false,
    socketMessage: ''
  },

  mutations:{
    SOCKET_connect(state) {
      state.isConnected = true;
			console.log('connected');
    },

    SOCKET_disconnect(state) {
      state.isConnected = false;
			console.log('disconnected');
    },

    SOCKET_messageChannel(state, message) {
      state.socketMessage = message
    },
		SOCKETSERVER_connect(state) {
      state.isConnected = true;
			console.log('server');
    },
  }
})