<template>
	<view class="u-p-l-40 u-p-r-40">
		<u-form :model="form" ref="uForm" :error-type="errorType">
			<u-form-item label="昵称" prop="name" required><u-input v-model="form.name" /></u-form-item>
		</u-form>
		<u-button type="primary" @click="submit">提交</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: {
				name: ''
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入昵称',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				]
			},
			errorType: ['message']
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules)
		this.form.name = this.vuex_user.name
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(async valid => {
				if (valid) {
					// 更新用户信息
					await this.$u.api.userInfoUpdate(this.form)
					// 刷新用户信息，更新vuex_user
					this.$u.utils.updateUser()

					this.$u.toast('更新成功')

					setTimeout(() => {
						this.$u.route({
							url: '/pages/center/center',
							type: 'switchTab'
						})
					}, 1500)
				}
			})
		}
	}
}
</script>

<style></style>
