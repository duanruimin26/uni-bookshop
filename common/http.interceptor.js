// 这里的vm，就是我们在vue文件里面的this，所以我们能在这里获取vuex的变量，比如存放在里面的token变量
const install = vm => {
	const $u = vm.config.globalProperties.$u
	// 此为自定义配置参数，具体参数见上方说明
	$u.http.setConfig({
		baseUrl: 'https://api.shop.eduwork.cn',
		showLoading: true,
		loadingText: '努力加载中~',
		loadingTime: 800,
		originalData: true,
		loadingMask: true
		// ......
	})

	// 请求拦截，配置Token等参数
	$u.http.interceptor.request = config => {
		// 引用token
		// 方式一，存放在vuex的token，假设使用了uView封装的vuex方式
		// 见：https://uviewui.com/components/globalVariable.html
		// config.header.token = vm.token;


		config.header.Authorization = 'Bearer' + vm.config.globalProperties.$store._state.data.vuex_token

		// 方式二，如果没有使用uView封装的vuex方法，那么需要使用$store.state获取
		// config.header.token = vm.$store.state.token;

		// 方式三，如果token放在了globalData，通过getApp().globalData获取
		// config.header.token = getApp().globalData.username;

		// 方式四，如果token放在了Storage本地存储中，拦截是每次请求都执行的
		// 所以哪怕您重新登录修改了Storage，下一次的请求将会是最新值
		// const token = uni.getStorageSync('token');
		// config.header.token = token;
		// config.header.Token = 'xxxxxx';

		// 可以对某个url进行特别处理，此url参数为this.$u.get(url)中的url值
		// if(config.url == '/user/login') config.header.noToken = true;
		// 最后需要将config进行return
		return config
		// 如果return一个false值，则会取消本次请求
		// if(config.url == '/user/rest') return false; // 取消某次请求
	}

	// 响应拦截，判断状态码是否通过
	$u.http.interceptor.response = res => {
		const {
			statusCode,
			data
		} = res
		if (statusCode < 400) {
			// 这里对data进行返回，将会在this.$u.post(url).then(res => {})的then回调中的res的到
			// 如果配置了originalData为true，请留意这里的返回值
			return data
		} else if (statusCode === 400) {
			// 错误的请求
			$u.toast(data.message)
			return false
		} else if (statusCode === 401) {
			// 401的情况有两种，一种是认证未通过，一种是没有token或者过期
			if (data.message === 'Unauthorized') {
				$u.toast('账号或密码错误')
			} else {
				// 401为token失效，这里跳转登录
				$u.utils.isLogin()
			}
			return false
		} else if (statusCode === 422) {
			// 表单验证未通过
			const { errors } = data
			$u.toast(Object.values(errors)[0][0])
			return false
		} else {
			// 如果返回false，则会调用Promise的reject回调，
			// 并将进入this.$u.post(url).then().catch(res=>{})的catch回调中，res为服务端的返回值
			return false
		}
	}

	$u.http.patch = (url, params = {}, header = {}) => {
		// 模拟patch请求
		const _params = {
			...params,
			_method: 'PATCH'
		}
		return $u.post(url, _params, header)
	}
}

export default { install }
