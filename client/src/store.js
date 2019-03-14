import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    servers: null,
  },

  mutations:{
    UPDATE_SERVERS(state, servers) {
			state.servers = servers
		}
  }
})