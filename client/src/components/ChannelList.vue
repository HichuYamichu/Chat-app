<template>
  <v-layout column>
    <v-flex>
      <h3 class="dispay-3">Channels</h3>
    </v-flex>
    <v-flex v-for="(channel, index) in $store.getters.servers[serverName].channels" :key="index">
      <v-btn block flat outline @click="changeChannel(channel.channelName)">{{ channel.channelName }}</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ["serverName"],
  methods: {
    changeChannel: function(channelName) {
      this.$store.commit("CHANGE_ACTIVECHANNEL", {
        channelName: channelName,
        serverName: this.serverName
      });
    }
  }
};
</script>

<style>
</style>
