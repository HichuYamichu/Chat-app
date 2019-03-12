import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'
import socket from './plugins/socket'
import './registerServiceWorker'

Vue.config.productionTip = false
 
// Vue.use(VueSocketio, io('http://localhost:3000'), { store });
Vue.use(socket)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
