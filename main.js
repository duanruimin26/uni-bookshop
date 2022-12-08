import App from './App'
import uView from './uni_modules/vk-uview-ui'
// http拦截器，此为需要加入的内容，如果不是写在common目录，请自行修改引入路径
import httpInterceptor from '@/common/http.interceptor.js'
// http接口API集中管理引入部分
import httpApi from '@/common/http.api.js'
// vuex
import vuexStore from '@/store/$u.mixin.js'
import store from '@/store'
// 自定义工具集中管理引入部分
import utils from '@/common/utils.js'


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false

App.mpType = 'app'

View.use(uView)
Vue.mixin(vuexStore)

const app = new Vue({
	store,
	...App
})

Vue.use(httpInterceptor, app)
Vue.use(httpApi, app)
Vue.use(utils, app)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(uView).use(httpInterceptor).use(httpApi).mixin(vuexStore).use(store).use(utils)
	return { app }
}
// #endif
