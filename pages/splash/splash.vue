<template>
	<view class="main">
		<view class="logo">
			<image class="image" src="../../static/ic_launcher.png">
				
			</image>
		</view>
		
		<view style="position: absolute;bottom: 100rpx;">
			<u-loading color="primary" size="64" :show="loading"></u-loading>
		</view>
		<view class="u-font-lg">
			四川凌霄无限科技有限公司
		</view>
		
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
			
		},
		mounted() {
			uni.navigateTo({
				url:"../user/login"
			})
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
	width: 300rpx;
	height: 300rpx;
}
</style>
