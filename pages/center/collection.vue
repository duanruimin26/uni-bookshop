<template>
	<view>
		<view class="u-p-20">
			<u-row gutter="16" class="u-skeleton">
				<u-col
					span="6"
					v-for="collection in collectionList.length !== 0 ? collectionList : [{}, {}, {}, {}]"
					:key="collection.id"
				>
					<goods-card :goods="collection.goods"></goods-card>
				</u-col>
				<!-- 骨架屏 -->
				<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
			</u-row>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			collectionList: [], // 收藏数据列表
			page: 1,
			loading: false
		};
	},
	onLoad() {
		this.getData();
	},
	onReachBottom() {
		// 重新请求数据，带上分页参数
		this.page = this.page + 1;
		this.getData();
	},
	methods: {
		async getData() {
			this.loading = true;
			const params = {
				page: this.page
			};
			const res = await this.$u.api.goodsCollects(params);
			this.loading = false;
			this.collectionList = [...this.collectionList, ...res.data];
		}
	}
};
</script>

<style lang="scss" scoped>
.goods-item {
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 12rpx 20rpx rgba(0, 0, 0, 0.1);

	// 标题
	.name {
		font-size: 32rpx;
		font-weight: bold;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		width: 100%;
	}

	// 价格
	.price {
		width: 100%;
		color: red;
	}
}
</style>
