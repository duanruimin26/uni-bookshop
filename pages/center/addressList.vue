<template>
	<view class="u-p-l-30 u-p-r-30 u-p-t-10">
		<u-swipe-action
			v-if="siteList.length > 0"
			class="item"
			:options="options"
			btn-width="240"
			v-for="(site, index) in siteList"
			:key="site.id"
			:index="site.id"
			@click="click"
			@content-click="contentClick"
		>
			<view class="top">
				<view class="name">{{ site.name }}</view>
				<view class="phone">{{ site.phone }}</view>
				<view class="tag" v-if="site.is_default"><text class="red">默认</text></view>
			</view>
			<view class="bottom">
				{{ site.province + site.city + site.county + site.address }}
				<u-icon name="edit-pen" :size="40" color="#999999" @click="toEdit(site.id)"></u-icon>
			</view>
		</u-swipe-action>
		<u-empty v-else text="暂无数据" mode="list"></u-empty>
		<view class="addSite" @tap="toAddSite">
			<view class="add">
				<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>
				新建收货地址
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			siteList: [],
			options: [
				{
					text: '设为默认',
					style: {
						backgroundColor: '#007aff'
					}
				},
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			],
			from: ''
		};
	},
	onLoad(option) {
		this.from = option.from;
		this.getData();
	},
	methods: {
		async getData() {
			this.siteList = [];
			const res = await this.$u.api.addressList();
			this.siteList = res.data;
		},
		toAddSite() {
			this.$u.route({
				url: '/pages/center/addressNew'
			});
		},
		async click(id, index) {
			// 设为默认
			if (index === 0) {
				await this.$u.api.addressDefault(id);
				this.$u.toast('设置成功');
			} else if (index == 1) {
				await this.$u.api.addressDelete(id);
				this.$u.toast('删除成功');
			}
			this.$nextTick(() => {
				this.getData();
			});
		},
		toEdit(id) {
			this.$u.route({
				url: '/pages/center/addressNew',
				params: {
					id
				}
			});
		},
		contentClick(id) {
			if (this.from === 'orderpreview') {
				uni.setStorageSync('select_address_id', id);
				this.$u.route({
					type: 'navigateBack'
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.item {
	padding: 20rpx;

	.top {
		display: flex;
		font-weight: bold;
		font-size: 34rpx;

		.phone {
			margin-left: 60rpx;
		}

		.tag {
			display: flex;
			font-weight: normal;
			align-items: center;

			text {
				display: block;
				width: 60rpx;
				height: 34rpx;
				line-height: 34rpx;
				color: #ffffff;
				font-size: 20rpx;
				border-radius: 6rpx;
				text-align: center;
				margin-left: 30rpx;
				background-color: rgb(49, 145, 253);
			}

			.red {
				background-color: red;
			}
		}
	}

	.bottom {
		display: flex;
		margin-top: 20rpx;
		font-size: 28rpx;
		justify-content: space-between;
		color: #999999;
	}
}

.addSite {
	display: flex;
	justify-content: space-around;
	width: 600rpx;
	line-height: 100rpx;
	position: absolute;
	bottom: 30rpx;
	left: 80rpx;
	background-color: red;
	border-radius: 60rpx;
	font-size: 30rpx;

	.add {
		display: flex;
		align-items: center;
		color: #ffffff;

		.icon {
			margin-right: 10rpx;
		}
	}
}
</style>
