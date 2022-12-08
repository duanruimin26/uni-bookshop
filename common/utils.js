const install = vm => {
	const $u = vm.config.globalProperties.$u
	// 首页
	const isLogin = () => {
		// 如果没有token，跳转到登录页面，要用redirectTo，因为navigateTo可以返回
		const token = vm.config.globalProperties.$store._state.data.vuex_token
		if (!token) {
			// 来自哪个页面
			const currentPage = getCurrentPages().pop()
			// 获取页面路径，和请求参数
			const {
				options,
				route,
				fullPath
			} = currentPage.$page

			// 下面这段代码微信运行报错，无法使用Object.keys，直接用fullPath替代，不用再处理查询参数
			// // 参数的key
			// const optionsKeys = Object.keys(options)
			// let params = ''
			// if (optionsKeys.length !== 0) {
			// 	params = optionsKeys.reduce((pre, current) => {
			// 		return `${pre}${current}=${options[current]}&`
			// 	}, '?').slice(0, -1)
			// }
			// 缓存当前页，用于登录或注册成功后的跳转
			// uni.setStorageSync('back_url', route + params)
			uni.setStorageSync('back_url', fullPath)
			$u.toast('请登录')
			setTimeout(() => {
				$u.route({
					url: '/pages/auth/login',
					type: 'redirectTo',
				})
			}, 1500)
			return false
		}
		return true
	}

	// 更新用户信息
	const updateUser = async () => {
		//重新请求用户信息
		const userInfo = await $u.api.userInfo()
		// 缓存用户信息
		$u.vuex('vuex_user', userInfo)
	}

	// 将各个定义的工具函数，统一放进对象挂载到vm.$u.utils下
	$u.utils = {
		isLogin,
		updateUser
	}
}

export default { install }
