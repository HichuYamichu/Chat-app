<template>
  <v-app>
    <page-header app class/>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import PageHeader from "./components/PageHeader";

export default {
  components: {
    PageHeader
  }
};
</script>


<style lang="stylus">
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html {
  overflow-y: auto;
}
</style>
