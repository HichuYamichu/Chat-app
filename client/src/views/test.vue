<template>
	<div class="main" v-scroll="onScroll">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid praesentium autem iure consectetur minus fugiat ipsum cum quos, dignissimos eius accusamus libero voluptatibus quibusdam possimus nesciunt ratione mollitia laboriosam ullam.
	</div>
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
