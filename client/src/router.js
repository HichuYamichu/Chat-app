import Vue from 'vue'
import Router from 'vue-router'
import _Server from './views/Server'
import Register from './views/Register'
import Login from './views/Login'
import NewServerForm from './views/NewServerForm'
import test from './views/test'
import store from './store/index'

Vue.use(Router)

export default new Router({
	mode: 'history',
	routes: [
    {
			path: '/',
			name: 'Chat-app',
			component: test,
			beforeEnter: (to, from, next) => {
				if (!store.getters.user) {
					next('/login')
				} else {
					next()
				}
			}
		},
		{
			path: '/test',
			name: 'test',
			component: test
		},
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
				if (!store.getters.user) {
					next('/login')
				} else {
					next()
				}
			}
		},
		{
			path: '/new',
			name: 'NewServerForm',
			component: NewServerForm,
			beforeEnter: (to, from, next) => {
				if (!store.getters.user) {
					next('/login')
				} else {
					next()
				}
			}
		},
	]
})
