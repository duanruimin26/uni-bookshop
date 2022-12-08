<template>
	<view class="u-p-20">
		<view class="top u-flex u-row-between u-m-b-20">
			<text class="font-bold">共计 {{ totalNum }} 件商品</text>
			<u-button style="margin: 0" size="mini" :type="orderStatusObj.color">{{ orderStatusObj.text }}</u-button>
		</view>
		<view class="u-m-b-30">
			<view class="font-bold">{{ site.name + '' + site.phone }}</view>
			<view>{{ site.province + site.city + site.county + site.address }}</view>
		</view>
		<view class="item u-p-10" v-for="(item, index) in goodsArr" :key="item.id">
			<view class="left u-m-r-20">
				<u-image :src="item.goods.cover_url" width="200rpx" height="200rpx" mode="aspectFill"></u-image>
			</view>
			<view class="right u-p-r-20">
				<view class="font-bold u-m-b-10 u-line-1">{{ item.goods.title }}</view>
				<view class="u-m-b-30 u-line-2">{{ item.goods.description }}</view>
				<view class="u-flex u-row-between">
					<view class="price">￥{{ item.price }}</view>
					<view class="number">x{{ item.num }}</view>
				</view>
			</view>
		</view>
		<view class="u-m-b-30 u-m-t-30">
			<view>
				<text class="font-bold">订单编号：</text>
				{{ orderInfo.order_no }}
			</view>
			<view>
				<text class="font-bold">下单时间：</text>
				{{ orderInfo.created_at }}
			</view>
		</view>
		<view class="font-bold">
			商品总额：
			<text class="price">¥ {{ orderInfo.amount }}</text>
		</view>

		<view class="footer u-flex u-row-right" v-if="orderInfo.status === 1">
			<view class="total font-bold">
				<text class="title">合计：</text>
				<text class="price">¥ {{ orderInfo.amount ? orderInfo.amount.toFixed(2) : 0.0 }}</text>
			</view>
			<u-button class="u-m-l-30 u-m-r-30" type="error" size="medium" :ripple="true" shape="circle" @click="goPay">
				立即付款
			</u-button>
		</view>

		<u-modal
			v-model="showModal"
			ref="uModal"
			:show-title="false"
			:show-confirm-button="false"
			:mask-close-able="true"
			width="360"
		>
			<view class="u-text-center"><u-image width="360rpx" height="360rpx" src="/static/pay.jpg"></u-image></view>
		</u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			orderId: '',
			site: {},
			orderInfo: {},
			goodsArr: [],
			orderStatus: {
				1: {
					text: '未支付',
					color: 'error'
				},
				2: {
					text: '已付款',
					color: 'success'
				},
				3: {
					text: '已发货',
					color: 'success'
				},
				4: {
					text: '已收货',
					color: 'success'
				},
				5: {
					text: '已过期',
					color: 'error'
				}
			},
			showModal: false
		};
	},
	onLoad(option) {
		this.orderId = option.id;
		this.getData();
	},
	computed: {
		totalNum() {
			let num = 0;
			if (this.orderInfo.orderDetails) {
				num = this.orderInfo.orderDetails.data.reduce((prev, next) => {
					return prev + next.num;
				}, 0);
			}
			return num;
		},
		orderStatusObj() {
			return this.orderStatus[this.orderInfo.status] || {};
		}
	},
	methods: {
		async getData() {
			const params = {
				include: 'orderDetails.goods,address'
			};
			const res = await this.$u.api.orderInfo(this.orderId, params);
			this.orderInfo = res;
			this.site = res.address;
			this.goodsArr = res.orderDetails.data;
		},
		async goPay() {
			this.showModal = true;
			const params = {
				type: 'aliyun'
			};
			// const res = await this.$u.api.orderPay(this.orderId, params) //这里请求二维码接口后台报错
			const res = await this.$u.api.orderPaytest(this.orderId, params);
			this.$u.toast('支付成功');
			setTimeout(() => {
				this.$u.route({
					url: '/pages/order/orderList',
					type: 'redirectTo'
				});
			}, 1500);
		}
	}
};
</script>

<style lang="scss" scoped>
.font-bold {
	font-weight: 600;
}

.price {
	color: red;
}

.item {
	display: flex;
	background-color: #f6f6f6;
}

.right {
	flex: 1;
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
