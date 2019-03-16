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
			const user = await this.axios.post('http://localhost:3000/api/users/login', { username: this.username, password: this.password })
			this.$connectServers(user.data.memberOf)
		}
	}
}
</script>

<style>

</style>
