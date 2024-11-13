import { createApp } from 'vue'
import './assets/index.css'
import App from './App.vue'
import pinia from './lib/store'


const app = createApp(App)
app.use(pinia)
app.mount('#app')
