<template>
	<view class="login">
		<u-toast ref="uToast" />
		<view class="content">
			<!-- 头部logo -->
			<view class="header" style="background-color: #FFFFFF;">
				<image src="/static/ic_launcher.png" style="width: 160rpx;height: 160rpx;"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<u-field v-model="phoneData" maxlength="11" label="用户名" placeholder="请填写用户名"></u-field>
				<u-field v-model="passData" label="密码" placeholder="请填写密码" password>
				</u-field>
			</view>
			<u-button :custom-style="customStyle" size="default" type="primary" shape="circle"
				:ripple="true" @click="startLogin()" :loading="isRotate">登 录</u-button>

			<!-- 其他登录 -->
			<view class="other_login cuIcon">
				<view class="login_icon">
					<view class="cuIcon-weixin" @tap="login_weixin"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-weibo" @tap="login_weibo"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-github" @tap="login_github"></view>
				</view>
			</view>

			<!-- 底部信息 -->
			<!-- <view class="footer">
				<navigator url="forget" open-type="navigate">找回密码</navigator>
				<text>|</text>
				<navigator url="register" open-type="navigate">注册账号</navigator>
			</view> -->
		</view>
	</view>
</template>

<script>
	var _this;
	

	export default {
		data() {
			return {
				phoneData: '', //用户/电话
				passData: '', //密码
				isRotate: false, //是否加载旋转
				customStyle: {
					marginTop: '80rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
					width: '600rpx'
				}
			};
		},
		
		mounted() {
			_this = this;
			let loginAccount = uni.getStorageSync("loginAccount")
			if(loginAccount){
				this.phoneData = loginAccount.account
				this.passData = loginAccount.password
			}
			
		},
		onLoad() {
			
		},
		methods: {
			async isLogin() {
				//判断缓存中是否登录过，直接登录
				try{
					let resp = await this.$request.get("/user/verify");
					if (resp.data.code != 200) {
						return;
					}
					console.log("已经登录了",resp.data)
					uni.redirectTo({
						url:'../index/index'
					})
				}catch(e){
					console.log("用户未登录")
				}
			},
			async startLogin() {
				//登录
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.phoneData.length == "") {

					this.$refs.uToast.show({
						title: '用户名不能为空',
						position: 'bottom',
						icon: false,
						type: 'error'
					})
					return;
				}
				if (this.passData.length < 5) {

					this.$refs.uToast.show({
						title: '密码不正确',
						position: 'bottom',
						icon: false,
						type: 'error'
					})
					return;
				}

				try {
					let resp = await this.$request.post("/user/login", {
						data: { 
							account: this.phoneData,
							password: this.passData,
						}
					});
					console.log("登录", resp.data);
					if (resp.data.code != 200) {
						this.$refs.uToast.show({
							title: resp.data.message,
							icon: false,
							position: 'bottom',
							type: 'error'
						})
						return;
					}
					uni.setStorageSync("user_info", resp.data.data);
					uni.redirectTo({
						url: "../index/index"
					})
					this.$refs.uToast.show({
						title: '登录成功',
						icon: false,
						position: 'bottom',
						type: 'success'
					})
					uni.setStorageSync("loginAccount",{
						account: this.phoneData,
						password: this.passData
					})
				} catch (e) {
					console.log("登录失败", e);
					this.$refs.uToast.show({
						title: '登录失败，请稍后再试',
						icon: false,
						position: 'bottom',
						type: 'error'
					})
				} finally {
					_this.isRotate = false
				}

			},
			login_weixin() {
				//微信登录
				this.$refs.uToast.show({
					title: '敬请期待',
					position: 'bottom',
					icon: false,
					type: 'success'
				})
			},
			login_weibo() {
				//微博登录
				this.$refs.uToast.show({
					title: '敬请期待',
					position: 'bottom',
					icon: false,
					type: 'success'
				})
			},
			login_github() {
				//github登录
				this.$refs.uToast.show({
					title: '敬请期待',
					position: 'bottom',
					icon: false,
					type: 'success'
				})
			}
		}
	}
</script>

<style>
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
	.login{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.content{
		margin-top: 100rpx;
	}
</style>
