import { createApp } from 'vue'
import App from './App.vue'
import store from './store' // Import the store you just created

const app = createApp(App)

app.use(store) // Tell Vue to use the Vuex store
app.mount('#app')
