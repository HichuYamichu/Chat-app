<template>
  <div>
    <v-list-tile class="pa-1">
      <v-list-tile-content>
        <v-list-tile-sub-title v-html=" message.author"></v-list-tile-sub-title>
        <v-list-tile-title v-html="message.content"></v-list-tile-title>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider></v-divider>
  </div>
</template>

<script>
export default {
  props: ["message"]
};
</script>

<style>
</style>
