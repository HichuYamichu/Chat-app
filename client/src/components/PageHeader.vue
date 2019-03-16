<template>
  <nav>
    <v-toolbar flat app dark class="primary">
      <v-toolbar-side-icon v-if="$store.getters.user" @click="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Chat-app</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn v-if="!$store.state.user" block flat to="/login">LOGIN</v-btn>
        <v-btn v-if="!$store.state.user" block flat to="/register">REGISTER</v-btn>
        <v-btn v-if="$store.state.user" block flat @click="logout">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer v-if="$store.getters.user" mini-variant app v-model="drawer">
      <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar v-for="(server, index) in $store.getters.userServers" :key="index">
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg">
          </v-list-tile-avatar>
        </v-list-tile>
      </v-list>
    </v-toolbar>
    </v-navigation-drawer>
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
			this.$store.dispatch('logout')
		}
	}
}
</script>

<style scoped>
</style>
