import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

import Print from 'vue-print-nb'
Vue.use(Print); //註冊
