<template>
  <v-card class="pa-2">
    <h1>{{ this.$route.params.serverName }}</h1>
    <v-layout row wrap justify-space-around fill-height>
      <v-flex xs12 class="chats">
        <simplebar data-simplebar-auto-hide="false">
          <v-list>
            <message-block v-for="(message, index) in messages" :key="index" :message="message"/>
          </v-list>
        </simplebar>
      </v-flex>
      <v-flex xs11 class="mt-3">
        <v-text-field v-on:keyup.enter="sendMessage" outline v-model="message.content"></v-text-field>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import MessageBlock from "../components/Message";
import simplebar from "simplebar-vue";
import "simplebar/dist/simplebar.min.css";

export default {
  components: {
    MessageBlock,
    simplebar
  },
  data() {
    return {
      serverNamespace: null,
      message: {
        author: this.$store.getters.user.username,
        content: ""
      },
      messages: []
    };
  },
  watch: {
    $route(to, from) {
      this.$forceUpdate();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init: function() {
      const serverName = this.$route.params.serverName;
      this.serverNamespace = this.$store.getters.servers[serverName];
      this.serverNamespace.on("connect", data => {
        console.log("connected");
      });

      this.serverNamespace.on("messageRecived", data => {
        this.messages.push(data);
      });
      console.log(this.serverNamespace);
    },
    sendMessage: function() {
      if (this.message.content == "") return;
      this.serverNamespace.emit("messageSend", this.message);
      this.message.content = "";
    }
  }
};
</script>

<style scaped>
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
