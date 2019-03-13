<template>
  <div class="home">
    <p v-if="$store.state.isConnected">We're connected to the server!</p>
    <p>Message from server: "{{ $store.state.socketMessage}}"</p>
    <button @click="message()">message</button>
    <button @click="create()">create</button>
  </div>
</template>

<script>
export default {
  methods: {
		message() {
			this.$sendMessage('moje message')
		},
		async create() {
			await this.axios.post('http://localhost:3000/api/new-server', {serverName: 'lolxD'})
			this.$addServer('lolxD')
		}
  }
};
</script>


<style lang="stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
