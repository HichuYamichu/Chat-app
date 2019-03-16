<template>
  <div>
    <!-- <button v-for="(server, index) in $store.state.servers" :key="index">{{ server.serverName }}</button> -->
    <input type="text" placeholder="server name" v-model="serverName">
    <button @click="create">create</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      serverName: ""
    };
  },
  methods: {
    message() {
      this.$sendMessage("moje message");
    },
    async create() {
      try {
        await this.axios.post("http://localhost:3000/api/servers/new-server", {
          serverName: this.serverName
        });
        this.$addServer(this.serverName);
      } catch (error) {
				console.log(error.response.data.error)
			}
    }
  }
};
</script>

<style>
</style>
