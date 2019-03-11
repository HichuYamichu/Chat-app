import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isConnected: false,
    socketMessage: ''
  },

  mutations:{
    SOCKET_CONNECT(state) {
      state.isConnected = true;
			console.log('connected');
    },

    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
			console.log('disconnected');
    },

    SOCKET_MESSAGECHANNEL(state, message) {
      state.socketMessage = message
    }
  }
})