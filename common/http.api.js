// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = vm => {
	const $u = vm.config.globalProperties.$u
	// 首页
	let index = (params = {}) => $u.http.get('/api/index', params)

	// 认证相关
	let authLogin = params => $u.post('/api/auth/login', params) //登录
	let authRegister = params => $u.post('/api/auth/register', params) //注册
	let authLogout = () => $u.post('/api/auth/logout') //退出登录
	let authOssToken = () => $u.get('/api/auth/oss/token') //获取OSStoken

	// 用户相关
	let userInfo = () => $u.http.get('/api/user') //用户详情
	let userInfoUpdate = params => $u.http.put('/api/user', params) //修改用户信息
	let userAvatar = params => $u.http.post('/api/user/avatar', params) // 修改用户头像

	// 商品相关
	let goodsInfo = id => $u.http.get('/api/goods/' + id) //商品详情
	let goodsCollect = id => $u.http.post('/api/collects/goods/' + id) //商品收藏
	let goodsList = (params = {}) => $u.http.get('/api/goods', params) //商品列表
	let goodsCollects = (params = {}) => $u.http.get('/api/collects', params) //收藏列表

	// 购物车相关
	let cartAdd = params => $u.http.post('/api/carts', params) //加入购物车
	let cartList = params => $u.http.get('/api/carts', params) //购物车列表
	let cartNum = (cartId, params) => $u.http.put('/api/carts/' + cartId, params) //改变购物车数量
	let cartDel = cartId => $u.http.delete('/api/carts/' + cartId) //移出购物车
	let cartChecked = params => $u.http.patch('/api/carts/checked', params) //购物车改变选中

	// 订单相关
	let orderPreview = () => $u.http.get('/api/orders/preview') //订单预览
	let orderSubmit = params => $u.http.post('/api/orders', params) //提交订单
	let orderInfo = (orderId, params) => $u.http.get('/api/orders/' + orderId, params) //订单详情
	let orderList = params => $u.http.get('/api/orders', params) //订单列表
	let orderPaytest = (orderId, params) => $u.http.patch(`/api/orders/${orderId}/paytest`, params) // 模拟支付
	let orderPay = (orderId, params) => $u.http.get(`/api/orders/${orderId}/pay`, params) // 获取支付二维码

	// 地址相关
	let addressList = () => $u.http.get('/api/address') //地址列表
	let addressInfo = addressId => $u.http.get('/api/address/' + addressId) //地址详情
	let addressUpdate = (addressId, params) => $u.http.put('/api/address/' + addressId, params) //更新地址
	let addressNew = params => $u.http.post('/api/address', params) //新增地址
	let addressDelete = addressId => $u.http.delete('/api/address/' + addressId) //删除地址
	let addressDefault = addressId => $u.http.patch('/api/address/' + addressId + '/default') //设为默认地址

	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	$u.api = {
		index,
		authLogin,
		authRegister,
		authLogout,
		authOssToken,
		userInfo,
		userInfoUpdate,
		userAvatar,
		goodsInfo,
		goodsCollect,
		goodsList,
		goodsCollects,
		cartAdd,
		cartList,
		cartNum,
		cartDel,
		cartChecked,
		orderPreview,
		orderSubmit,
		orderInfo,
		orderList,
		orderPaytest,
		orderPay,
		addressList,
		addressInfo,
		addressUpdate,
		addressNew,
		addressDelete,
		addressDefault
	}
}

export default { install }
