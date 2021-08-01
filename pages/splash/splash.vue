<template>
	<view class="main">
		<view class="logo">
			<image class="image" src="../../static/splash.png">
				
			</image>
		</view>
		
		<view style="position: absolute;bottom: 100rpx;">
			<u-loading color="primary" size="64" :show="loading"></u-loading>
		</view>
		<!-- <view class="u-font-lg">
			成都养利网络科技有限公司
		</view> -->
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: true
			}
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
					uni.setStorageSync("user_info",resp.data.data)
					uni.redirectTo({
						url:'../index/index'
					})
				}catch(e){
					console.log("用户未登录")
					uni.navigateTo({
						url:"../user/login"
					})
				}
			},
		},
		mounted() {
			this.isLogin()
		}
	}
</script>

<style>
.main{
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
.logo{
	display: flex;
	justify-content: center;
	margin-top: 100rpx;
}
.logo image {
	width: 720rpx;
	height: 720rpx;
}
</style>
