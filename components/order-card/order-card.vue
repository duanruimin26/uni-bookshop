<template>
	<view class="page-box">
		<block v-if="orderList.length > 0">
			<navigator
				:url="'/pages/order/orderInfo?id=' + order.id"
				class="order"
				v-for="(order, index) in orderList"
				:key="order.id"
			>
				<view class="total u-flex u-row-between">
					<text style="font-size: 28rpx">共计 {{ totalNum(order.orderDetails.data) }} 件商品</text>
					<u-button style="margin: 0" size="mini" :type="orderStatus[order.status].color">
						{{ orderStatus[order.status].text }}
					</u-button>
				</view>
				<view class="item" v-for="(item, index) in order.orderDetails.data" :key="index">
					<view class="left"><image :src="item.goods.cover_url" mode="aspectFill"></image></view>
					<view class="content u-p-r-20">
						<view class="title u-line-2">{{ item.goods.title }}</view>
						<view class="type">{{ item.goods.description }}</view>
						<view class="u-flex u-row-between">
							<view class="price">￥{{ item.price }}</view>
							<view class="number">x{{ item.num }}</view>
						</view>
					</view>
				</view>
				<view class="bottom u-flex u-row-between">
					<text class="time">{{ order.created_at }}</text>
					<u-button v-if="orderStatus[order.status].operation" class="btn" size="mini" type="success">
						{{ orderStatus[order.status].operation }}
					</u-button>
				</view>
			</navigator>
			<u-loadmore :status="loadStatus" class="u-p-b-40"></u-loadmore>
		</block>
		<block v-else>
			<view class="centre">
				<image src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
				<view class="explain">
					您还没有相关的订单
					<view class="tips">可以去看看有那些想买的</view>
				</view>
				<view class="btn">随便逛逛</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	name: 'order-card',
	props: {
		orderList: {
			type: Array,
			default() {
				return []
			}
		},
		loadStatus: {
			type: String,
			default() {
				return ''
			}
		}
	},
	data() {
		return {
			orderStatus: {
				1: {
					text: '未支付',
					color: 'error',
					operation: '去付款'
				},
				2: {
					text: '已付款',
					color: 'success'
				},
				3: {
					text: '已发货',
					color: 'success',
					operation: '确认收货'
				},
				4: {
					text: '已收货',
					color: 'success',
					operation: '立即评价'
				},
				5: {
					text: '已过期',
					color: 'error'
				}
			}
		}
	},
	methods: {
		// 总件数
		totalNum(item) {
			let num = 0
			item.map(val => {
				num += val.num
			})
			return num
		}
	}
}
</script>

<style lang="scss" scoped>
.order {
	width: 710rpx;
	background-color: #ffffff;
	margin: 20rpx auto;
	border-radius: 20rpx;
	box-sizing: border-box;
	padding: 20rpx;
	font-size: 28rpx;
	background-color: #f6f6f6;
	border-radius: 10rpx;

	.total {
		margin: 20rpx 0;
		font-size: 24rpx;
	}

	.item {
		display: flex;

		.left {
			margin-right: 20rpx;

			image {
				width: 200rpx;
				height: 200rpx;
				padding: 10rpx;
				border-radius: 10rpx;
			}
		}

		.content {
			flex-grow: 1;

			.title {
				margin-top: 20rpx;
				font-size: 28rpx;
				font-weight: 600;
				line-height: 50rpx;
			}

			.type {
				margin: 10rpx 0 40rpx;
				font-size: 24rpx;
				color: $u-tips-color;
			}

			.price {
				color: red;
			}
		}
	}

	.bottom {
		display: flex;
		margin-top: 40rpx;
		justify-content: space-between;
		align-items: center;

		.time {
			color: #6a6a6a;
		}

		.btn {
			margin: 0;
		}
	}
}

.centre {
	text-align: center;
	padding-top: 200rpx;
	font-size: 32rpx;

	image {
		width: 164rpx;
		height: 164rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
	}

	.tips {
		font-size: 24rpx;
		color: #999999;
		margin-top: 20rpx;
	}

	.btn {
		margin: 80rpx auto;
		width: 200rpx;
		border-radius: 32rpx;
		line-height: 64rpx;
		color: #ffffff;
		font-size: 26rpx;
		background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
	}
}
</style>
