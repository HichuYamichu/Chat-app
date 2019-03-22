<template>
  <v-card class="pb-1">
    <v-layout row wrap justify-space-between>
      <v-flex xs12 class="mb-2">
        <v-toolbar card flat color="secondary">
          <v-spacer></v-spacer>
          <v-toolbar-title class="font-weight-medium display-1">{{ serverName }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-flex>
      <v-flex xs3 sm2 md2 lg1>
        <channel-list :serverName="serverName"/>
      </v-flex>
      <v-flex xs7 sm9 md10 lg11>
        <chat :key="serverName" :serverName="serverName"/>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import Chat from "../components/Chat";
import ChannelList from "../components/ChannelList";

export default {
  components: {
    Chat,
    ChannelList
  },
  data() {
    return {
      serverName: this.$route.params.serverName
    };
  },
  methods: {
    changeServer: function(serverName) {
      this.serverName = serverName;
    },
    createChannel: function() {
      this.serverNamespace.emit("createChannel", this.activeChannel);
    }
  },
  watch: {
    $route(to, from) {
      this.changeServer(this.$route.params.serverName);
    }
  }
};
</script>

<style>
</style>
