import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import {
  createVuetify
} from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'myTheme',
      themes: {
        myTheme: {
          colors: {
            surface: '#041D36', // drop
            'surface-light': '#041D36', // header
            background: '#0D5B76',
          },
        },
      },
    },
  })
  app.vueApp.use(vuetify)
})