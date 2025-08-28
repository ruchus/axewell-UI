import './assets/main.css'

import { createApp } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import {
    Quasar,
    Notify,
    Loading,
    Dialog
  } from 'quasar' 
import { i18n } from './plugins/i18n'
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/src/css/index.sass'
import '../src/app.scss'

import App from './App.vue'
import router from './router'
import { messages } from './locales'

const app = createApp(App)


const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(Quasar, {
    plugins: {
      Loading,
      Notify,
      Dialog
    },
})
app.use(i18n)
app.mount('#app')
