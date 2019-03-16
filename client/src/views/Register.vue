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
			this.axios.post('http://localhost:3000/api/users/register', { username: this.username, password: this.password })
		}
	}
}
</script>

<style>

</style>
