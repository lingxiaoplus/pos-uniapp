<template>
	<view>
		<u-navbar back-text="返回" title="重置密码" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }"></u-navbar>
		<view class="forget" style="margin-top: 100rpx;">
			<view class="content">
				<!-- 主体 -->
				<view class="main">
					<view class="tips">若你想要修改密码，可在此重置新密码。</view>
					<!-- <u-field v-model="phoneData" maxlength="11" label="手机号" placeholder="请填写手机号"></u-field> -->
					<u-field v-model="passData" label="旧密码" placeholder="请填写旧密码" password></u-field>
					<u-field v-model="newPassData" label="密码" placeholder="请填写新密码" password></u-field>
					<u-field v-model="newPassDataRepetition" label="重复密码" placeholder="请重新填写新密码" password></u-field>
					<!-- <u-field v-model="verCode" label="验证码" maxlength="6" placeholder="请填写验证码">
						<u-button size="mini" slot="right" type="success" 
						@click="getVerCode()">{{codeText}}</u-button>
						<u-verification-code seconds="60" ref="uCode" @change="codeChange()"></u-verification-code>
					</u-field> -->
					
				</view>

				<u-button :custom-style="customStyle" size="default" type="primary" shape="circle" :ripple="true" @click="startRePass()" :loading="isRotate">重置密码</u-button>
			</view>
		</view>
		<u-modal @confirm="goLogin()" v-model="resetSuccess" content="重置密码成功,请重新登录" />
	</view>
</template>

<script>
var _this;
import wInput from '../../components/watch-login/watch-input.vue'; //input
import wButton from '../../components/watch-login/watch-button.vue'; //button
export default {
	data() {
		return {
			phoneData: '', //电话
			passData: '', //密码
			newPassData: '',
			newPassDataRepetition: '',
			verCode: '', //验证码
			isRotate: false, //是否加载旋转
			customStyle: {
				marginTop: '80rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				width: '600rpx'
			},
			codeText: "获取验证码",
			background: getApp().globalData.background,
			resetSuccess: false,
		};
	},
	components: {
		wInput,
		wButton
	},
	mounted() {
		_this = this;
	},
	methods: {
		back() {
			uni.navigateBack({});
		},
		codeChange(text) {
			console.log("倒计时",text)
			this.codeText = text;
		},
		getVerCode() {
			//获取验证码
			if (_this.phoneData.length != 11) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '手机号不正确'
				});
				return false;
			}
			console.log('获取验证码');

			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码'
				});
				setTimeout(() => {
					uni.hideLoading();
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}, 1000);
			} else {
				//this.$u.toast('倒计时结束后再发送');
			}
		},
		startRePass() {
			//重置密码
			if (this.isRotate) {
				//判断是否加载中，避免重复点击请求
				return false;
			}
			if (this.passData.length < 6) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '密码长度小于6位'
				});
				return false;
			}
			if (this.newPassData != this.newPassDataRepetition) {
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '两次密码不一致'
				});
				return false;
			}
			this.resetPassword()
		},
		goLogin(){
			uni.navigateTo({
				url:"login"
			})
		},
		async resetPassword(){
			try{
				_this.isRotate = true;
				let user = uni.getStorageSync('user_info');
				let resp = await this.$request.post("/user/resetPassword",{
					data:{
						userId: user.userId,
						oldPassword: this.passData,
						newPassword: this.newPassData
					}
				});
				if (resp.data.code != 200) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '重置密码失败: ' + resp.data.message
					});
					return;
				}
				this.resetSuccess = true;
				uni.clearStorageSync()
			}catch(e){
				console.log("重置密码失败",e)
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '重置密码失败, 请稍后再试'
				});
			}finally{
				_this.isRotate = false;
			}
		}
	}
};
</script>

<style>
@import url('../../components/watch-login/css/icon.css');
@import url('./css/main.css');
</style>
