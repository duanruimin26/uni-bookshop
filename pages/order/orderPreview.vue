<template>
	<view>
		<navigator url="/pages/center/addressList?from=orderpreview" class="u-flex u-row-between u-p-30">
			<view v-if="site && site.province">
				<view class="u-m-b-10 address">{{ site.province + site.city + site.county + site.address }}</view>
				<view>{{ site.name + ' ' + site.phone }}</view>
			</view>
			<u-icon name="arrow-right" color="rgb(144, 147, 153)"></u-icon>
		</navigator>
		<view class="order u-flex u-col-top u-m-30" v-for="(item, index) in carts" :key="item.id">
			<u-image width="180rpx" height="180rpx" :src="item.goods.cover_url"></u-image>
			<view class="u-m-l-20 u-m-r-20 u-flex-1">
				<view class="title u-m-t-20 u-m-b-40">{{ item.goods.title }}</view>
				<view class="bottom">
					<text class="price">¥ {{ item.goods.price }}</text>
					<text class="num">x {{ item.num }}</text>
				</view>
			</view>
		</view>

		<view class="footer u-flex u-row-right">
			<view class="total">
				<text class="title">合计：</text>
				<text class="price">¥ {{ totalPrice }}</text>
			</view>
			<u-button
				class="u-m-l-30 u-m-r-30"
				type="error"
				size="medium"
				:ripple="true"
				shape="circle"
				@click="submitOrder"
			>
				提交订单并支付
			</u-button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			carts: [],
			addressList: [],
			site: {},
			select_address_id: ''
		}
	},
	onLoad() {},
	onShow() {
		this.select_address_id = uni.getStorageSync('select_address_id')
		this.getData()
	},
	computed: {
		totalPrice() {
			let price = 0
			this.carts.forEach(cell => {
				price += cell.goods.price * cell.num
			})
			return price.toFixed(2)
		}
	},
	methods: {
		async getData() {
			const res = await this.$u.api.orderPreview()
			this.carts = res.carts
			this.addressList = res.address
			if (this.select_address_id) {
				this.site = this.addressList.filter(item => item.id === this.select_address_id)[0]
				uni.setStorageSync('select_address_id', '')
			} else {
				this.site = this.addressList.filter(item => item.is_default)[0]
			}
		},
		async submitOrder() {
			const params = {
				address_id: this.site.id
			}
			const res = await this.$u.api.orderSubmit(params)
			this.goPay(res.id)
		},
		async goPay(orderId) {
			const params = {
				type: 'aliyun'
			}
			const res = await this.$u.api.orderPaytest(orderId, params)
			this.$u.toast('支付成功')
			setTimeout(() => {
				this.$u.route({
					url: '/pages/order/orderList',
					type: 'redirectTo'
				})
			}, 1500)
		}
	}
}
</script>

<style lang="scss" scoped>
.address {
	font-weight: 600;
}

.order {
	.title {
		font-size: 34rpx;
		font-weight: 600;
	}

	.bottom {
		display: flex;
		justify-content: space-between;

		.price {
			font-size: 28rpx;
			font-weight: bold;
			color: red;
		}
	}
}

.footer {
	position: fixed;
	bottom: 20rpx;
	height: 100rpx;
	line-height: 100rpx;
	width: 100%;

	.total {
		font-weight: 600;
	}

	.price {
		color: red;
	}
}
</style>
