<template>
	<view class="u-m-t-20">
		<view class="page-box">
			<view class="u-p-l-20 u-p-r-20 u-flex" v-for="(item, index) in cartList" :key="item.id">
				<view class="u-flex-1">
					<u-checkbox
						v-model="item.is_checked"
						:name="item.id"
						shape="circle"
						@change="changeCheck"
					></u-checkbox>
				</view>
				<view class="u-flex u-flex-11 u-col-top good-item u-p-10">
					<u-image width="180" height="180" :src="item.goods.cover_url"></u-image>
					<view class="right u-m-l-20">
						<view class="top u-flex-col">
							<text class="title">{{ item.goods.title }}</text>
							<text class="desc">{{ item.goods.description }}</text>
						</view>
						<view class="bottom u-flex">
							<text class="price">¥ {{ item.goods.price }}</text>
							<u-number-box
								class="num"
								v-model="item.num"
								:min="1"
								@change="numChange(item)"
							></u-number-box>
							<u-icon name="trash" color="red" size="36" @click="del(item.id)"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="u-flex-5 u-p-l-30"><u-checkbox v-model="allCheck" shape="circle">全选</u-checkbox></view>
			<view class="u-flex u-flex-7 u-row-around">
				<view class="">
					<text class="title">合计：</text>
					<text class="price">¥ {{ totalPrice }}</text>
				</view>
				<u-button
					type="error"
					style="width: 200rpx"
					size="medium"
					:ripple="true"
					shape="circle"
					:disabled="isEmpty"
					@click="goSettle"
				>
					去结算
				</u-button>
			</view>
		</view>
		<u-modal
			v-model="show"
			content="确认要移除商品吗？"
			:show-cancel-button="true"
			@cancel="show = false"
			@confirm="confirm"
		></u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cartList: [],
			cartId: '',
			show: false
		}
	},
	computed: {
		allCheck: {
			get() {
				return this.cartList.length > 0 && this.cartList.every(item => item.is_checked)
			},
			set(val) {
				this.checkAll(val)
			}
		},
		totalPrice() {
			let price = 0
			this.cartList
				.filter(item => item.is_checked)
				.forEach(cell => {
					price += cell.goods.price * cell.num
				})
			return price.toFixed(2)
		},
		isEmpty() {
			return this.cartList.filter(item => item.is_checked).length === 0
		}
	},
	onLoad() {
		this.$u.utils.isLogin()
	},
	onShow() {
		this.getData()
	},
	methods: {
		async getData() {
			const res = await this.$u.api.cartList({
				include: 'goods'
			})
			this.cartList = res.data
		},
		del(id) {
			this.cartId = id
			this.show = true
		},
		async confirm() {
			const res = await this.$u.api.cartDel(this.cartId)
			this.$u.toast('移除商品成功')
			this.getData()
		},
		async changeCheck(val) {
			let cart_ids = []
			this.cartList.forEach(item => {
				if (item.is_checked) {
					cart_ids.push(item.id)
				}
			})
			const { name, value } = val
			if (value) {
				cart_ids.push(name)
			} else {
				cart_ids.splice(cart_ids.indexOf(name), 1)
			}
			await this.$u.api.cartChecked({
				cart_ids
			})
			this.getData()
		},
		async checkAll(val) {
			let cart_ids = []
			if (val) {
				this.cartList.forEach(item => {
					cart_ids.push(item.id)
				})
			}
			await this.$u.api.cartChecked({
				cart_ids
			})
			this.getData()
		},
		async numChange(item) {
			await this.$u.api.cartNum(item.id, {
				num: item.num
			})
		},
		goSettle() {
			this.$u.route({
				url: '/pages/order/orderPreview',
				type: 'navigateTo'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.page-box {
	padding-bottom: 120rpx;
}

.good-item {
	background-color: #faf9f9;

	.right {
		.top {
			margin-bottom: 20rpx;

			text {
				height: 40rpx;
				line-height: 40rpx;
				width: 100%;
				text-align-last: left;
			}

			.title {
				font-weight: bold;
			}
		}

		.bottom {
			.price {
				height: 50rpx;
				width: 120rpx;
				line-height: 50rpx;
				overflow: hidden;
				color: red;
				font-weight: bold;
				font-size: 35rpx;
			}

			.num {
				width: 240rpx;
			}
		}
	}
}

.footer {
	position: fixed;
	display: flex;
	bottom: 0;
	/* #ifdef H5 */
	bottom: 100rpx;
	/* #endif */
	height: 100rpx;
	line-height: 100rpx;
	width: 100%;
	background-color: #faf9f9;

	.price {
		color: red;
	}
}
</style>
