<template>
  <v-list>
    <v-list-tile-title class="text-xs-center headline mb-2">Channels</v-list-tile-title>
    <v-list-tile
      v-for="(channel, index) in $store.getters.servers[serverName].channels"
      :key="index"
    >
      <v-btn
        block
        flat
        outline
        @click="changeChannel(channel.channelName)"
      >{{ channel.channelName }}</v-btn>
    </v-list-tile>
  </v-list>
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

<style scoped>
.active {
  background-color: black !important;
}
</style>
