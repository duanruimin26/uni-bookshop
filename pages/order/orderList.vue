<template>
	<view>
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper
					ref="tabs"
					active-color="#f29100"
					:list="list"
					:current="current"
					@change="change"
					:is-scroll="false"
					swiperWidth="750"
				></u-tabs-swiper>
			</view>
			<swiper
				class="swiper-box"
				:current="swiperCurrent"
				@transition="transition"
				@animationfinish="animationfinish"
			>
				<swiper-item class="swiper-item" v-for="(item, index) in 5" :key="item">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="reachBottom">
						<view v-if="showLoading" class="u-text-center u-m-60">
							<u-loading class="loading" :show="showLoading"></u-loading>
						</view>
						<order-card v-else :orderList="orderList" :loadStatus="loadStatus[index]"></order-card>
					</scroll-view>
				</swiper-item>
			</swiper>
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
			swiperCurrent: 0,
			showLoading: true,
			tabsHeight: 0,
			dx: 0,
			loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore', 'loadmore'],
			page: 1,
			isLast: false // 是否是最后一页
		};
	},
	onLoad() {
		this.getOrderList(this.current);
	},

	methods: {
		reachBottom() {
			// 此tab为空数据
			if (this.isLast) return;
			this.loadStatus.splice(this.current, 1, 'loading');
			this.page = this.page + 1;
			this.getOrderList(this.current);
		},
		// 页面数据
		async getOrderList(index) {
			const params = {
				page: this.page,
				status: index + 1,
				include: 'orderDetails.goods'
			};
			const res = await this.$u.api.orderList(params);
			const { current_page, total_pages } = res.meta.pagination;
			this.showLoading = false;
			this.orderList = [...this.orderList, ...res.data];
			this.isLast = current_page === total_pages ? true : false;
			if (this.isLast) {
				this.loadStatus.splice(index, 1, 'nomore');
			} else {
				this.loadStatus.splice(index, 1, 'loadmore');
			}
		},
		// tab栏切换
		change(index) {
			this.swiperCurrent = index;
			this.current = index;
			this.showLoading = true;
			this.orderList = [];
			this.page = 1;
			this.isLast = false;
			this.getOrderList(index);
		},
		transition({ detail: { dx } }) {
			this.$refs.tabs.setDx(dx);
		},
		animationfinish({ detail: { current, source } }) {
			this.$refs.tabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			if (this.current !== current && source == 'touch') {
				this.orderList = [];
				this.page = 1;
				this.isLast = false;
				this.showLoading = true;
				this.getOrderList(current);
			}
			this.current = current;
		}
	}
};
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
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
}

.swiper-box {
	flex: 1;
}

.swiper-item {
	height: 100%;
}

.loading {
	margin: 0 auto;
}
</style>
