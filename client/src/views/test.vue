<template>
  <v-card width="100px" flat>
    <div class="headline text-xs-center pa-5">
      Active:
    </div>
    <v-bottom-nav
      :value="true"
      absolute
      color="transparent"
    >
      <v-btn
        color="teal"
        flat
        value="recent"
      >
        <span>Recent</span>
        <v-icon>history</v-icon>
      </v-btn>

      <v-btn
        color="teal"
        flat
        value="favorites"
      >
        <span>Favorites</span>
        <v-icon>favorite</v-icon>
      </v-btn>

      <v-btn
        color="teal"
        flat
        value="nearby"
      >
        <span>Nearby</span>
        <v-icon>place</v-icon>
      </v-btn>
    </v-bottom-nav>
  </v-card>
</template>

<script>
export default {
	methods: {
		onScroll: function() {
			console.log('asd')
		}
	}
}
</script>

<style scoped>
.main {
	max-height: 100px;
	width: 200px;
	overflow: auto;
}
</style>
