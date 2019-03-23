<template>
  <nav>
    <v-toolbar flat app clipped-left dark class="primary">
      <v-toolbar-title>Chat-app</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-if="!$store.getters.user" block flat to="/login">login</v-btn>
        <v-btn v-if="!$store.getters.user" block flat to="/register">register</v-btn>
        <v-btn v-if="$store.getters.user" block flat to="/new">Create server</v-btn>
        <v-btn v-if="$store.getters.user" block flat @click="logout">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      drawer: false
    };
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout");
			this.$router.push('/')
    },
		go: function(server, index) {
			this.$router.push({ path: `/servers/${server.serverName}`})
		}
  }
};
</script>

<style scoped>
</style>
