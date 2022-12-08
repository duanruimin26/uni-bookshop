<template>
	<view>
		<view class="u-flex user-box u-p-t-30 u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10 avatar-body"><oss-upload></oss-upload></view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{ vuex_user.name }}</view>
				<view class="u-font-14 u-tips-color">邮箱:{{ vuex_user.email }}</view>
			</view>
		</view>

		<view class="u-m-t-20">
			<u-cell-group><u-cell-item icon="setting" title="个人信息" @click="toBaseInfo"></u-cell-item></u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="rmb-circle" title="所有订单" @click="toOrder"></u-cell-item>
				<u-cell-item icon="star" title="商品收藏" @click="toCollection"></u-cell-item>
				<u-cell-item icon="map" title="收货地址" @click="toAddress"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group><u-cell-item icon="reload" title="退出登录" @click="logout"></u-cell-item></u-cell-group>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: true
		};
	},
	onLoad() {
		this.$u.utils.isLogin();
	},
	methods: {
		toBaseInfo() {
			this.$u.route({
				url: '/pages/center/baseInfo'
			});
		},
		toAddress() {
			this.$u.route({
				url: '/pages/center/addressList'
			});
		},
		toCollection() {
			this.$u.route({
				url: '/pages/center/collection'
			});
		},
		toOrder() {
			this.$u.route({
				url: '/pages/order/orderList'
			});
		},
		// 退出登录
		async logout() {
			// 请求API，退出登录
			await this.$u.api.authLogout();

			this.$u.toast('退出成功');

			setTimeout(() => {
				//跳转到首页
				this.$u.route({
					type: 'reLaunch',
					url: 'pages/index/index'
				});
			}, 1500);

			// 清除缓存的token和用户信息
			this.$u.vuex('vuex_token', null);
			this.$u.vuex('vuex_user', {});
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #ededed;
}

.camera {
	width: 54px;
	height: 44px;

	&:active {
		background-color: #ededed;
	}
}

.user-box {
	background-color: #fff;
}

.slot-btn {
	width: 329rpx;
	height: 140rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background: rgb(244, 245, 246);
	border-radius: 10rpx;
}

.slot-btn__hover {
	background-color: rgb(235, 236, 238);
}

.avatar-body {
	height: 70px;
	width: 70px;
}
</style>
