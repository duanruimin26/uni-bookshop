<template>
	<view class="u-wrap">
		<view class="u-search-box">
			<u-search
				placeholder="输入商品名称"
				v-model="keyword"
				@custom="searchGoods"
				@clear="searchGoods"
			></u-search>
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<block v-for="(item, index) in categories" :key="item.id">
					<view
						v-for="(c, ci) in item.children"
						:key="c.id"
						class="u-tab-item"
						:class="[current == c.id ? 'u-tab-item-active' : '']"
						:data-current="c.id"
						@tap.stop="swichMenu(c.id)"
					>
						<text class="u-line-1">{{ c.name }}</text>
					</view>
				</block>
			</scroll-view>
			<block v-if="true">
				<scroll-view scroll-y class="right-box" @scrolltolower="scrollEvent">
					<view class="page-view">
						<view class="class-item">
							<!-- 		<view class="item-title">
								<text>{{item.name}}</text>
							</view> -->
							<view class="item-container">
								<navigator
									:url="`/pages/goods/show?id=${item1.id}`"
									class="thumb-box u-p-b-40 u-p-t-40"
									v-for="(item1, index1) in goodsList"
									:key="item1.id"
								>
									<image class="item-menu-image" :src="item1.cover_url" mode=""></image>
									<view class="item-menu-name">{{ item1.title }}</view>
								</navigator>
								<view v-if="goodsList.length === 0" class="u-flex-1 u-p-t-80 u-p-b-80">
									<u-empty text="暂无数据" mode="list"></u-empty>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			categories: [],
			goodsList: [],
			scrollTop: 0, //tab标题的滚动条位置
			current: '', // 预设当前项的值
			menuHeight: 0, // 左边菜单的高度
			menuItemHeight: 0, // 左边菜单item的高度
			keyword: '',
			page: 1,
			isLast: false // 是否是最后一页
		};
	},
	computed: {},
	onLoad() {
		this.getData();
	},
	methods: {
		async getData() {
			const params = {
				page: this.page,
				title: this.keyword
			};
			if (this.current) params.category_id = this.current;
			const res = await this.$u.api.goodsList(params);
			this.categories = res.categories.slice(-4);
			this.goodsList = [...this.goodsList, ...res.goods.data];
			this.isLast = res.goods.next_page_url ? false : true;
		},
		// 点击左边的栏目切换
		async swichMenu(cid) {
			if (cid == this.current) return;
			this.current = cid;
			this.page = 1;
			this.goodsList = [];
			this.getData();
			// // 如果为0，意味着尚未初始化
			// if (this.menuHeight == 0 || this.menuItemHeight == 0) {
			// 	await this.getElRect('menu-scroll-view', 'menuHeight');
			// 	await this.getElRect('u-tab-item', 'menuItemHeight');
			// }
			// // 将菜单菜单活动item垂直居中
			// this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
		},
		// 获取一个目标元素的高度
		getElRect(elClass, dataVal) {
			new Promise((resolve, reject) => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.' + elClass)
					.fields(
						{
							size: true
						},
						res => {
							// 如果节点尚未生成，res值为null，循环调用执行
							if (!res) {
								setTimeout(() => {
									this.getElRect(elClass);
								}, 10);
								return;
							}
							this[dataVal] = res.height;
						}
					)
					.exec();
			});
		},
		searchGoods() {
			this.page = 1;
			this.goodsList = [];
			this.getData();
		},
		// 右侧区域滚动到底部加载下一页
		scrollEvent(e) {
			if (this.isLast) return;
			this.page = this.page + 1;
			this.getData();
		}
	}
};
</script>

<style lang="scss" scoped>
.u-wrap {
	height: calc(100vh);
	/* #ifdef H5 */
	height: calc(100vh - var(--window-top));
	/* #endif */
	display: flex;
	flex-direction: column;
}

.u-search-box {
	padding: 18rpx 30rpx;
}

.u-menu-wrap {
	flex: 1;
	display: flex;
	overflow: hidden;
}

.u-search-inner {
	background-color: rgb(234, 234, 234);
	border-radius: 100rpx;
	display: flex;
	align-items: center;
	padding: 10rpx 16rpx;
}

.u-search-text {
	font-size: 26rpx;
	color: $u-tips-color;
	margin-left: 10rpx;
}

.u-tab-view {
	width: 200rpx;
	height: 100%;
}

.u-tab-item {
	height: 110rpx;
	background: #f6f6f6;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #444;
	font-weight: 400;
	line-height: 1;
}

.u-tab-item-active {
	position: relative;
	color: #000;
	font-size: 30rpx;
	font-weight: 600;
	background: #fff;
}

.u-tab-item-active::before {
	content: '';
	position: absolute;
	border-left: 4px solid $u-type-primary;
	height: 32rpx;
	left: 0;
	top: 39rpx;
}

.u-tab-view {
	height: 100%;
}

.right-box {
	background-color: rgb(250, 250, 250);
}

.page-view {
	padding: 16rpx;
}

.class-item {
	margin-bottom: 30rpx;
	background-color: #fff;
	padding: 16rpx;
	border-radius: 8rpx;
}

.item-title {
	font-size: 26rpx;
	color: $u-main-color;
	font-weight: bold;
}

.item-menu-name {
	font-weight: normal;
	font-size: 24rpx;
	color: $u-main-color;
}

.item-container {
	display: flex;
	flex-wrap: wrap;
}

.navigator-wrap {
	width: 50%;
}

.thumb-box {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin-top: 20rpx;
}

.item-menu-image {
	width: 120rpx;
	height: 120rpx;
}
</style>
