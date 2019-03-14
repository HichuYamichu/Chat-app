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
			userName: '',
			password: ''
		}
	},
	methods: {
		register: function() {
			tihs.$axios.post('http://localhost:3000/api/register', { userName: this.userName, password: this.password })
		}
	}
}
</script>

<style>

</style>
