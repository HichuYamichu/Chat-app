<template>
  <v-list>
    <v-list-tile-title class="text-xs-center headline mb-2">Channels</v-list-tile-title>
    <v-list-tile
      v-for="(channel, index) in $store.getters.servers[serverName].channels"
      :key="index"
    >
      <v-btn
        :input-value="$store.getters.activeChannel(serverName).channelName !== channel.channelName ? 'active' : ''"
        color="primary"
        block
        flat
        outline
        @click="changeChannel(channel.channelName)"
      >{{ channel.channelName }}</v-btn>
    </v-list-tile>
    <v-list-tile-action-text>
      <v-btn flat outline small fab color="cyan" @click="dialog = true">
        <v-icon>add</v-icon>
      </v-btn>
    </v-list-tile-action-text>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Create new channel</v-card-title>
        <v-card-text>
          <v-text-field v-model="newChannelName"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="cyan" flat @click="createChannel">Create</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
export default {
  props: ["serverName"],
  data() {
    return {
      dialog: false,
      newChannelName: ""
    };
  },
  methods: {
    changeChannel: function(channelName) {
      this.$store.commit("CHANGE_ACTIVECHANNEL", {
        channelName: channelName,
        serverName: this.serverName
      });
    },
    createChannel: function() {
      this.$store.getters
        .activeServer(this.serverName)
        .namespace.emit("createChannel", this.newChannelName);
        // TODO ERROR HANDLING AND DYNAMIC UPDATE
      this.drawer = false;
    }
  }
};
</script>

<style scoped>
</style>
