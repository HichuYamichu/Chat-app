<template>
  <v-app>
    <page-header app/>
    <v-content>
      <v-container fluid>
        <v-layout>
          <div v-if="$store.getters.user" class="mr-4 ">
            <v-btn
              class="my-3"
              fab
              icon
              block
              small
              v-for="(server, index) in $store.getters.servers"
              :key="index"
              @click="go(server)"
            >
              <v-avatar>
                <img src="https://randomuser.me/api/portraits/men/85.jpg">
              </v-avatar>
            </v-btn>
          </div>
          <v-flex xs12>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import PageHeader from "./components/PageHeader";

export default {
  components: {
    PageHeader
  },
  methods: {
    logout: function() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
    go: function(server, index) {
      this.$router.push({ path: `/servers/${server.serverName}` });
    }
  }
};
</script>


<style lang="stylus">
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html {
  overflow-y: auto !important;
}

.serverBar {
  width: 5%;
  position: fixed;
  left: 0;
  display: block;
}
</style>
