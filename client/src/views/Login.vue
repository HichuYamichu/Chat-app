<template>
	<div>
		<input type="text" v-model="userName" placeholder="username">
		<input type="password" v-model="password" placeholder="password">
		<button @click="login">Login</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			userName: '',
			password: ''
		}
	},
	methods: {
		login: function() {
			const user = this.$axios.post('http://localhost:3000/api/login', { userName: this.userName, password: this.password })
			this.$connectServers(user.memberOf)
		}
	}
}
</script>

<style>

</style>
