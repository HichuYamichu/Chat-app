<template>
  <v-layout row justify-space-around>
    <v-flex xs1>
      <channel-list :serverName="serverName"/>
    </v-flex>
    <v-flex xs10>
      <chat :key="serverName" :serverName="serverName"/>
    </v-flex>
  </v-layout>
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
