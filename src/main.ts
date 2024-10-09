import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import '@mdi/font/css/materialdesignicons.css' 
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Components
import App from './App.vue'
import router from './router'

// Criação do Vuetify
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

// Criação da aplicação Vue
const app = createApp(App)

// Registro dos plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)

// Montagem da aplicação
app.mount('#app')
