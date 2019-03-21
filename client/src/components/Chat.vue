<template>
  <div class="chat">
    <v-layout row wrap justify-space-around>
      <v-flex xs12 class="chats">
        <simplebar data-simplebar-auto-hide="false">
          <v-list>
            <message-block
              v-for="(message, index) in activeChannel.messages"
              :key="index"
              :message="message"
            />
          </v-list>
        </simplebar>
      </v-flex>
      <v-flex xs11 class="mt-3">
        <v-text-field v-on:keyup.enter="sendMessage" outline v-model="message.content"></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import MessageBlock from "../components/Message";
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";

export default {
  props: ["serverName"],
  components: {
    MessageBlock,
    simplebar
  },
  data() {
    return {
      message: {
        author: this.$store.getters.user.username,
        content: ""
      },
      messages: []
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
  created() {
    this.serverNamespace.on("connect", data => {
      console.log("connected");
    });

    this.serverNamespace.emit(
      "init",
      this.allChannels.map(channel => channel.channelName)
    );

    this.serverNamespace.on("messageRecived", data => {
      this.activeChannel.channelName;
      console.log(this.$store);
      this.$store.dispatch("messageRecived", {
        serverName: this.serverName,
        activeChannel: this.activeChannel,
        message: data
      });
      this.messages.push(data);
    });
  },
  methods: {
    sendMessage: function() {
      if (this.message.content == "") return;
      this.serverNamespace.emit("messageSend", {
        channel: this.activeChannel.channelName,
        message: this.message
      });
      this.message.content = "";
    }
  }
};
</script>

<style scaped>
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
}

.simplebar-content {
  display: flex;
  flex-direction: column-reverse;
}
</style>
