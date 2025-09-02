import { createApp } from 'vue'
import './index.css'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from "./router";

// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入 SweetAlert2 (不用 app.use)
import Swal from 'sweetalert2'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')

export { Swal }
