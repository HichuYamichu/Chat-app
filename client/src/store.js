import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    servers: {},
  },

  mutations:{
    UPDATE_SERVERS(state, namespace, serverName) {
			state.servers[namespace.nsp.substring(1)] = namespace
			console.log(state.servers);
		}
  }
})