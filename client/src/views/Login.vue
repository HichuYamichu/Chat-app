<template>
	<div>
		<input type="text" v-model="username" placeholder="username">
		<input type="password" v-model="password" placeholder="password">
		<button @click="login">Login</button>
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
		login: async function() {
			await this.$store.dispatch('login', { username: this.username, password: this.password } )
		}
	}
}
</script>

<style>

</style>
