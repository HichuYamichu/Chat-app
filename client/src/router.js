import Vue from 'vue'
import Router from 'vue-router'
import _Server from './views/Server'
import Register from './views/Register'
import Login from './views/Login'
import Dashboard from './views/Dashboard'
import store from './store/index'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/login',
			name: 'Login',
			component: Login
		},
		{
			path: '/register',
			name: 'Register',
			component: Register
		},
		{
			path: '/servers/:serverName',
			name: 'Server',
			component: _Server,
			beforeEnter: (to, from, next) => {
				if (!store.state.user) {
					next('/')
				} else {
					next()
				}
			}
		},
		{
			path: '/dashboard',
			name: 'Dashboard',
			component: Dashboard
		},
	]
})
