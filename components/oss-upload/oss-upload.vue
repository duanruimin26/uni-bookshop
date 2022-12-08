<template>
	<view>
		<u-upload
			ref="uUpload"
			:action="action"
			:max-size="5 * 1024 * 1024"
			max-count="1"
			:multiple="false"
			:before-upload="beforeUpload"
			:custom-btn="true"
			:show-progress="false"
			:form-data="formData"
			:deletable="false"
			widht="0"
			height="0"
			@on-success="onSuccess"
		>
			<template v-slot:addBtn>
				<u-avatar :src="vuex_user.avatar_url" size="140"></u-avatar>
			</template>
		</u-upload>
	</view>
</template>

<script>
let _this;
export default {
	name: 'oss-upload',
	data() {
		return {
			action: '',
			formData: {},
			upFileName: ''
		};
	},
	created() {
		_this = this;
	},
	methods: {
		// 上传前的钩子
		// 注意：在小程序中this可能会丢失
		async beforeUpload(index, list) {
			const { file } = list[0];

			let fileName = '';
			// #ifdef H5
			fileName = file.name;
			// #endif

			// 小程序中想获取文件名是file.path
			// #ifndef H5
			fileName = file.path;
			// #endif

			// 请求API，获取oss token
			const ossToken = await _this.$u.api.authOssToken();

			// 设置上传域名
			_this.action = ossToken.host;
			// 处理唯一文件名
			const suffix = fileName.slice(fileName.lastIndexOf('.'));
			_this.upFileName = _this.$u.guid(20) + suffix;

			// 额外的上传参数
			_this.formData = {
				key: _this.upFileName, //上传后的文件名
				policy: ossToken.policy,
				OSSAccessKeyId: ossToken.accessid,
				success_action_status: '200', //让服务端返回200,不然，默认会返回204
				signature: ossToken.signature
			};

			return true;
		},
		// 上传成功之后
		async onSuccess() {
			// 移除预览区域的图片
			this.$refs.uUpload.remove(0);
			// 请求API更新头像
			await this.$u.api.userAvatar({
				avatar: _this.upFileName
			});
			// 更新缓存的用户信息
			this.$u.utils.updateUser();
			this.$u.toast('更新成功');
		}
	}
};
</script>

<style>
.slot-btn {
	width: 100rpx;
	height: 100rpx;
}
</style>
