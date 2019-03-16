<template>
  <div>
    <h1>{{ $route.params.serverName }}</h1>
    <input type="text" placeholder="message" v-model="message">
    <button @click="sendMessage">Send Message</button>
		<div class="chat">
			<span v-for="(message, index) in messages" :key="index">{{ message }}</span>
		</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      serverNamespace: null,
      message: "",
			messages: []
    };
  },
  watch: {
    $route(to, from) {
      this.init()
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init: function() {
      const serverName = this.$route.params.serverName;
      this.serverNamespace = this.$store.state.servers[serverName];
      this.serverNamespace.on("connect", data => {
        console.log("connected");
      });

      this.serverNamespace.on("messageRecived", data => {
				this.messages.push(data)
        console.log(data);
      });
    },
    sendMessage: function() {
      this.serverNamespace.emit("messageSend", this.message);
    }
  }
};
</script>

<style scaped>
	.chat {
		height: 400px;
		width: 400px;
		border: 4px solid black;	
	}
</style>
