<template>
	<view>
		<view style="text-align: center;">
			<u-image height="220px" :src="goodsInfo.cover_url" :fade="true" duration="450" />
		</view>
		<view class="top2" style="margin-top: 10px">
			<view class="title u-line-2">{{ goodsInfo.title }}</view>
			<view class="des">
				<view class="price">¥ {{ goodsInfo.price }}</view>
				<view class="sales">销量 {{ goodsInfo.sales }}</view>
			</view>
		</view>
		<view><u-tabs :list="list" :is-scroll="false" v-model="current" @change="change"></u-tabs></view>

		<view v-if="current == 0">
			<view class="info u-p-b-80"><u-parse :html="goodsInfo.details"></u-parse></view>
		</view>

		<view v-if="current == 1">
			<view class="comment" v-for="(res, index) in commentList" :key="res.id">
				<view class="left"><image :src="res.user.avatar_url" mode="aspectFill"></image></view>
				<view class="right">
					<view class="top">
						<view class="name">{{ res.user.name }}</view>
					</view>
					<view class="content">{{ res.content }}</view>
					<view class="bottom">{{ res.created_at }}</view>
				</view>
			</view>
		</view>

		<view class="u-p-b-80" v-if="current == 2">
			<u-row gutter="16" class="u-skeleton">
				<u-col span="6" v-for="goods in goodsList.length !== 0 ? goodsList : [{}, {}, {}, {}]" :key="goods.id">
					<goods-card :goods="goods"></goods-card>
				</u-col>
			</u-row>
		</view>

		<view
			class="navigation"
			style="position: fixed; bottom: 0; width: 100%; display: flex;justify-content: space-around;"
		>
			<view class="left">
				<view class="item u-text-center" @click="collect">
					<block v-if="isCollect === 0">
						<u-icon name="star" :size="40" color="black"></u-icon>
						<view class="text u-line-1">收藏</view>
					</block>
					<block v-else>
						<u-icon name="star" :size="40" color="red"></u-icon>
						<view class="text u-line-1" style="color: red">已收藏</view>
					</block>
				</view>
				<view class="item car" @click="toCart">
					<u-badge class="car-num" :count="cartCount" type="error" :offset="[-3, -6]"></u-badge>
					<u-icon name="shopping-cart" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">购物车</view>
				</view>
			</view>
			<view class="right">
				<view class="cart btn u-line-1" @click="addCart">加入购物车</view>
				<!-- <view class="buy btn u-line-1">立即购买</view> -->
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					name: '商品详情'
				},
				{
					name: '商品评论',
					count: 0
				},
				{
					name: '推荐商品'
				}
			],
			current: 0,
			goodsInfo: {},
			commentList: [],
			goodsList: [],
			goodsId: null,
			isCollect: 0,
			cartCount: 0
		}
	},
	onLoad(option) {
		this.goodsId = option.id
		this.getData()
		this.getCartCount()
	},
	methods: {
		async getData() {
			const res = await this.$u.api.goodsInfo(this.goodsId)
			this.goodsInfo = res.goods
			this.commentList = res.goods.comments
			this.list[1].count = res.goods.comments.length
			this.goodsList = res.like_goods
			this.isCollect = res.goods.is_collect
		},
		change(index) {
			this.current = index
		},
		// 收藏商品
		async collect() {
			// 请求收藏API
			await this.$u.api.goodsCollect(this.goodsId)
			// 收藏成功之后，提示消息，改变收藏状态
			if (this.isCollect === 0) {
				this.$u.toast('收藏成功')
				this.isCollect = 1
			} else {
				this.$u.toast('取消收藏')
				this.isCollect = 0
			}
		},
		// 加入购物车
		async addCart() {
			const params = {
				goods_id: this.goodsId
			}
			await this.$u.api.cartAdd(params)

			//提示消息
			this.$u.toast('添加成功')
			//重新获取购物车数据
			this.getCartCount()
		},
		// 获取购物车数量
		async getCartCount() {
			const token = this.vuex_token

			if (token) {
				const res = await this.$u.api.cartList()
				this.cartCount = res.data.length
			}
		},
		// 跳转到购物车
		toCart() {
			this.$u.route({
				url: '/pages/cart/cart',
				type: 'switchTab'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.top2 {
	margin: 40rpx 0;
	padding: 30rpx 40rpx;
	background: white;
	margin-bottom: 0;
}

.title {
	font-weight: 600;
	font-size: 36rpx;
}

.des {
	margin-top: 30rpx;
	display: flex;
	justify-content: space-between;
}

.price {
	font-size: 36rpx;
	color: red;
	font-weight: 600;
}

.sales {
	color: #333;
}

.comment {
	display: flex;
	padding: 30rpx;

	.left {
		image {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background-color: #f2f2f2;
		}
	}

	.right {
		flex: 1;
		padding-left: 20rpx;
		font-size: 30rpx;

		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10rpx;

			.name {
				color: #5677fc;
			}

			.like {
				display: flex;
				align-items: center;
				color: #9a9a9a;
				font-size: 26rpx;

				.num {
					margin-right: 4rpx;
					color: #9a9a9a;
				}
			}

			.highlight {
				color: #5677fc;

				.num {
					color: #5677fc;
				}
			}
		}

		.content {
			margin-bottom: 10rpx;
		}

		.reply-box {
			background-color: rgb(242, 242, 242);
			border-radius: 12rpx;

			.item {
				padding: 20rpx;
				border-bottom: solid 2rpx $u-border-color;

				.username {
					font-size: 24rpx;
					color: #999999;
				}
			}

			.all-reply {
				padding: 20rpx;
				display: flex;
				color: #5677fc;
				align-items: center;

				.more {
					margin-left: 6rpx;
				}
			}
		}

		.bottom {
			margin-top: 20rpx;
			display: flex;
			font-size: 24rpx;
			color: #9a9a9a;

			.reply {
				color: #5677fc;
				margin-left: 10rpx;
			}
		}
	}
}

.navigation {
	display: flex;
	margin-top: 100rpx;
	border: solid 2rpx #f2f2f2;
	background-color: #ffffff;
	padding: 16rpx 0;

	.left {
		display: flex;
		font-size: 20rpx;

		.item {
			margin: 0 30rpx;

			&.car {
				text-align: center;
				position: relative;

				.car-num {
					position: absolute;
					// top: -10rpx;
					// right: -10rpx;
				}
			}
		}
	}

	.right {
		display: flex;
		font-size: 28rpx;
		align-items: center;

		.btn {
			line-height: 66rpx;
			padding: 0 30rpx;
			border-radius: 36rpx;
			color: #ffffff;
		}

		.cart {
			background-color: #ed3f14;
			margin-right: 30rpx;
		}

		.buy {
			background-color: #ff7900;
		}
	}
}
</style>
