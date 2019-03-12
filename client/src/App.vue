<template>
  <div class="home">
    <p v-if="$store.state.isConnected">We're connected to the server!</p>
    <p>Message from server: "{{ $store.state.socketMessage}}"</p>
    <button @click="pingServer()">Ping Server</button>
    <button @click="createServer()">createServer</button>
    <button @click="check()">check</button>
  </div>
</template>

<script>
export default {
  methods: {
    pingServer() {
      this.$mainSocket.emit("createServer", "lol");
    },
    createServer(data = 'name') {
      this.$addServer(data)
    },
		check() {
			console.log(this.$serverSockets)
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
