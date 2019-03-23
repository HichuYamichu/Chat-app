<template>
  <v-card class="pa-4">
    <v-layout row wrap justify-space-around>
      <v-flex xs12 class="mb-2">
        <h1 class="display-1">Registation</h1>
      </v-flex>
      <v-flex xs12 md8>
        <v-text-field outline type="text" v-model="username" label="username"></v-text-field>
      </v-flex>
      <v-flex xs12 md8>
        <v-text-field outline type="password" v-model="password" label="password"></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-btn class="primary" @click="register">register</v-btn>
      </v-flex>
    </v-layout>
    <error-dialog v-model="error" :message="errorMessage"/>
  </v-card>
</template>

<script>
import ErrorDialog from "../components/ErrorDialog";

export default {
  components: {
    ErrorDialog
  },
  data() {
    return {
      username: "",
      password: "",
      error: "",
      errorMessage: ""
    };
  },
  methods: {
    register: function() {
      try {
        this.$store.dispatch("register", {
          username: this.username,
          password: this.password
        });
      } catch (error) {
        this.error = true
				this.errorMessage = error.response.data.error
      }
    }
  }
};
</script>

<style>
</style>
