// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'Vue'
import App from './App'
import mainMenu from './components/mainMenu'
import partyRoom from './components/partyRoom'

require('../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss')
const css = require('./scss/main.scss')
import VueSocketio from 'vue-socket.io'

//  Vue.use(VueSocketio, '192.168.1.243:8000')
Vue.use(VueSocketio, 'http://localhost:8000')
// Components
Vue.component('mainMenu', mainMenu)
Vue.component('partyRoom', partyRoom)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
