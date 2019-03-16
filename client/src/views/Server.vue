<template>
  <div>
    <h1>{{ $route.params.serverName }}</h1>
    <input type="text" placeholder="message" v-model="message">
    <button @click="sendMessage">Send Message</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      serverNamespace: null,
      message: ""
    };
  },
  watch: {
    $route(to, from) {
      this.init()
    }
  },
  created() {
    this.init();
  },
  methods: {
    init: function() {
      const serverName = this.$route.params.serverName;
			console.log(serverName)
      this.serverNamespace = this.$store.state.servers[serverName];
      this.serverNamespace.on("connect", data => {
        console.log("connected");
      });

      this.serverNamespace.on("messageRecived", data => {
        console.log(data);
      });
    },
    sendMessage: function() {
      this.serverNamespace.emit("messageSend", this.message);
    }
  }
};
</script>

<style>
</style>
