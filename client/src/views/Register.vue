<template>
	<div>
		<input type="text" v-model="username" placeholder="username">
		<input type="password" v-model="password" placeholder="password">
		<button @click="register">register</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			username: '',
			password: ''
		}
	},
	methods: {
		register: function() {
			this.$store.dispatch('register', { username: this.username, password: this.password })
		}
	}
}
</script>

<style>

</style>
