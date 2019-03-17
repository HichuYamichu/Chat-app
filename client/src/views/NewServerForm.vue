<template>
  <v-card>
    <v-form>
      <v-layout row wrap justify-space-around>
        <v-flex>
          <h1 class="display-2 py-2">Create new server</h1>
        </v-flex>
        <v-flex xs10 class="mt-1">
          <v-text-field outline type="text" label="server name" v-model="serverName"></v-text-field>
        </v-flex>
        <v-flex xs10>
          <v-btn class="primary" @click="create">create</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
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
      serverName: "",
			error: '',
			errorMessage: ''
    };
  },
  methods: {
    async create() {
      try {
        await this.$store.dispatch("createServer", this.serverName);
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
