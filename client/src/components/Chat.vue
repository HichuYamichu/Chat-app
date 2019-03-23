<template>
  <div class="chat">
    <v-layout row wrap justify-space-around>
      <v-flex xs12 class="chats" v-scroll="onScroll" id="style-1">
        <v-list v-scroll="onScroll">
          <message-block
            v-for="(message, index) in activeChannel.messages"
            :key="index"
            :message="message"
          />
        </v-list>
      </v-flex>
      <v-flex xs11 class="mt-3">
        <v-text-field v-on:keyup.enter="sendMessage" outline v-model="message.content"></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import MessageBlock from "../components/Message";
import _ from "lodash.throttle";

export default {
  props: ["serverName"],
  components: {
    MessageBlock,
  },
  data() {
    return {
      message: {
        author: this.$store.getters.user.username,
        content: ""
      }
    };
  },
  computed: {
    serverNamespace: function() {
      return this.$store.getters.activeServer(this.serverName).namespace;
    },
    activeChannel: function() {
      return this.$store.getters.activeChannel(this.serverName);
    },
    allChannels: function() {
      return this.$store.getters.activeServer(this.serverName).channels;
    }
  },
  methods: {
    sendMessage: function() {
      if (this.message.content == "") return;
      this.message.date = Date.now();
      this.serverNamespace.emit("messageSend", {
        channel: this.activeChannel.channelName,
        message: this.message
      });
      this.message.content = "";
    },
    onScroll: function(e) {
      if (e.target.scrollTop !== 0) return
      this.serverNamespace.emit('fetchMessages', {
        channel: this.activeChannel.channelName,
        lastMesssageIndex: this.activeChannel.messages[0].date
      })
    }
  }
};
</script>

<style scoped>
#style-1::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

#style-1::-webkit-scrollbar {
  width: 7px;
  background-color: #f5f5f5;
}

#style-1::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(78, 78, 78, 0.3);
  background-color: #555;
}

.chat {
  border-left: 1px solid lightgray;
}

.typer {
  position: absolute;
  bottom: 0;
  display: block;
  width: 70%;
}

.chats {
  height: 70vh;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}

</style>
