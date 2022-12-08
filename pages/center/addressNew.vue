<template>
	<view class="wrap u-p-30">
		<u-form :model="form" ref="uForm" :error-type="errorType" :label-width="200">
			<u-form-item label="联系姓名" prop="name" required>
				<u-input placeholder="联系人姓名" v-model="form.name" />
			</u-form-item>
			<u-form-item label="联系电话" prop="phone" required>
				<u-input placeholder="联系人电话" v-model="form.phone" type="number"></u-input>
			</u-form-item>
			<u-form-item label="选择城市" prop="region" required>
				<u-input
					type="select"
					:select-open="pickerShow"
					v-model="form.region"
					placeholder="选择城市"
					@click="pickerShow = true"
				></u-input>
			</u-form-item>
			<u-form-item label="详细地址" prop="address" required>
				<u-input placeholder="详细地址" v-model="form.address"></u-input>
			</u-form-item>
			<u-form-item label="是否默认" prop="is_default">
				<u-switch v-model="form.is_default"></u-switch>
			</u-form-item>
		</u-form>

		<u-button type="primary" @click="submit">提交</u-button>

		<u-picker
			mode="region"
			ref="uPicker"
			v-model="pickerShow"
			@confirm="regionConfirm"
			:default-region="defaultRegionArr"
		/>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				name: '',
				phone: '',
				address: '',
				region: '',
				is_default: false
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入联系姓名',
						trigger: ['change', 'blur']
					}
				],
				phone: [
					{
						required: true,
						message: '请输入联系电话',
						trigger: ['change', 'blur']
					},
					{
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// this.$u.test.mobile()就是返回true或者false的
							return this.$u.test.mobile(value)
						},
						message: '手机号码不正确',
						trigger: ['change', 'blur']
					}
				],
				region: [
					{
						required: true,
						message: '请选择城市',
						trigger: ['change', 'blur']
					}
				],
				address: [
					{
						required: true,
						message: '请输入详细地址',
						trigger: ['change', 'blur']
					}
				]
			},
			errorType: ['message'],
			pickerShow: false,
			province: '',
			city: '',
			area: '',
			addressId: ''
		}
	},
	computed: {
		defaultRegion() {
			const defaultRegionArr =
				this.province && this.city && this.area ? [this.province, this.city, this.area] : []
			return defaultRegionArr
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules)
	},
	onLoad(option) {
		if (option) {
			this.addressId = option.id
			this.getData(option.id)
		}
	},
	methods: {
		async getData(id) {
			const res = await this.$u.api.addressInfo(id)
			this.form = {
				...res
			}
			this.form.region = res.province + '-' + res.city + '-' + res.county
			this.province = res.province
			this.city = res.city
			this.area = res.county
		},
		regionConfirm(e) {
			this.form.region = e.province.name + '-' + e.city.name + '-' + e.area.name
			this.province = e.province.name
			this.city = e.city.name
			this.area = e.area.name
		},
		submit() {
			this.$refs.uForm.validate(async valid => {
				if (valid) {
					const params = {
						...this.form,
						province: this.province,
						city: this.city,
						county: this.area,
						is_default: this.form.is_default ? 1 : 0
					}
					delete params.region

					// 新增地址
					if (!this.addressId) {
						await this.$u.api.addressNew(params)
						this.$u.toast('新增地址成功')
					} else {
						await this.$u.api.addressUpdate(this.addressId, params)
						this.$u.toast('修改地址成功')
					}

					setTimeout(() => {
						this.$u.route({
							url: '/pages/center/addressList'
						})
					}, 1500)
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.line {
	color: $u-light-color;
	font-size: 28rpx;
}

.wrap {
	.top {
		background-color: #ffffff;
		border-top: solid 2rpx $u-border-color;
		padding: 22rpx;

		.item {
			display: flex;
			font-size: 32rpx;
			line-height: 100rpx;
			align-items: center;
			border-bottom: solid 2rpx $u-border-color;

			.left {
				width: 180rpx;
			}

			input {
				text-align: left;
			}
		}

		.address {
			padding: 20rpx 0;

			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
		}

		.site-clipboard {
			padding-right: 40rpx;

			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}

			.clipboard {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				color: $u-tips-color;
				height: 80rpx;

				.icon {
					margin-top: 6rpx;
					margin-left: 10rpx;
				}
			}
		}
	}

	.bottom {
		margin-top: 20rpx;
		padding: 40rpx;
		padding-right: 0;
		background-color: #ffffff;
		font-size: 28rpx;

		.tag {
			display: flex;

			.left {
				width: 160rpx;
			}

			.right {
				display: flex;
				flex-wrap: wrap;

				.tags {
					width: 140rpx;
					padding: 16rpx 8rpx;
					border: solid 2rpx $u-border-color;
					text-align: center;
					border-radius: 50rpx;
					margin: 0 10rpx 20rpx;
					display: flex;
					font-size: 28rpx;
					align-items: center;
					justify-content: center;
					color: $u-content-color;
					line-height: 1;
				}

				.plus {
					//padding: 10rpx 0;
				}
			}
		}

		.default {
			margin-top: 50rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: solid 2rpx $u-border-color;
			line-height: 64rpx;

			.tips {
				font-size: 24rpx;
			}

			.right {
			}
		}
	}
}
</style>
