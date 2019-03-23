import axios from 'axios';

const user = {
  state: {
    user: null
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    LOGOUT(state, user) {
      state.user = null;
    }
  },
  actions: {
    async register({ commit }, credentials) {
      try {
        const user = await axios.post(
          'http://localhost:3000/api/users/register',
          {
            username: credentials.username,
            password: credentials.password,
            memberOf: []
          }
        );
        commit('SET_USER', user.data);
      } catch (error) {
        throw error
      }
    },
    async login({ commit, dispatch }, credentials) {
      try {
        const res = await axios.post('http://localhost:3000/api/users/login', {
          username: credentials.username,
          password: credentials.password
        });
        commit('SET_USER', res.data.user);
        dispatch('handleLogin', res.data.servers, { root: true });
      } catch (error) {
        throw error;
      }
    },
    async logout({ commit, dispatch }) {
      commit('LOGOUT');
      dispatch('disconnectSockets', null, { root: true });
    }
  },
  getters: {
    user: state => state.user
  }
};

export default user;
