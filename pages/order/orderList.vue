<template>
	<view>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs
					ref="tabs"
					active-color="#f29100"
					:list="list"
					v-model="current"
					@change="change"
					:is-scroll="false"
				></u-tabs>
			</view>
			<view class="swiper-box">
				<scroll-view
					class="order"
					scroll-y
					scroll-with-animatio
					:scroll-top="scrollTop"
					@scroll="scroll"
					style="height: 100%;width: 100%;"
					@scrolltolower="reachBottom"
				>
					<view v-if="showLoading" class="u-text-center u-m-60">
						<u-loading class="loading" :show="showLoading"></u-loading>
					</view>
					<order-card v-else :orderList="orderList" :loadStatus="loadStatus"></order-card>
				</scroll-view>
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
					name: '待付款'
				},
				{
					name: '已支付'
				},
				{
					name: '待收货'
				},
				{
					name: '已完成'
				},
				{
					name: '已过期'
				}
			],
			current: 0,
			orderList: [],
			showLoading: true,
			loadStatus: 'loadmore',
			page: 1,
			isLast: false, // 是否是最后一页
			scrollTop: 0,
			old: {
				scrollTop: 0
			}
		}
	},
	onLoad() {
		this.getOrderList(this.current)
	},
	methods: {
		reachBottom() {
			// 此tab为空数据
			if (this.isLast) return
			this.loadStatus = 'loading'
			this.page = this.page + 1
			this.getOrderList(this.current)
		},
		// 页面数据
		async getOrderList(index) {
			const params = {
				page: this.page,
				status: index + 1,
				include: 'orderDetails.goods'
			}
			const res = await this.$u.api.orderList(params)
			const { current_page, total_pages } = res.meta.pagination
			this.showLoading = false
			this.orderList = [...this.orderList, ...res.data]
			this.isLast = current_page >= total_pages ? true : false
			if (this.isLast) {
				this.loadStatus = 'nomore'
			} else {
				this.loadStatus = 'loadmore'
			}
		},
		// tab栏切换
		change(index) {
			this.current = index
			this.showLoading = true
			this.goTop()
			this.orderList = []
			this.page = 1
			this.isLast = false
			this.getOrderList(index)
		},
		scroll: function(e) {
			this.old.scrollTop = e.detail.scrollTop
		},
		goTop: function(e) {
			this.scrollTop = this.old.scrollTop
			this.$nextTick(function() {
				this.scrollTop = 0
			})
		}
	}
}
</script>

<style>
/* #ifndef H5 */
page {
	height: 100%;
	background-color: #f2f2f2;
}

/* #endif */
</style>

<style lang="scss" scoped>
.wrap {
	height: calc(100vh);
	/* #ifdef H5 */
	height: calc(100vh - var(--window-top));
	/* #endif */
	display: flex;
	flex-direction: column;
	width: 100%;
}

.swiper-box {
	flex: 1;
	overflow: hidden;
}

.order {
	height: 100%;
}

.loading {
	margin: 0 auto;
}
</style>
