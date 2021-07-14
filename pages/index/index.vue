<template>
	<view>
		<u-swiper :list="list"></u-swiper>
		<u-grid :col="3">
			<u-grid-item @click="onGridClick(0)">
				<u-icon name="list-dot" color='primary' :size="46"></u-icon>
				<view class="grid-text">订单</view>
			</u-grid-item>
			<u-grid-item @click="onGridClick(1)">
				<u-icon name="edit-pen" color='primary' :size="46"></u-icon>
				<view class="grid-text">日报</view>
			</u-grid-item>
			<u-grid-item @click="onGridClick(2)">
				<u-icon name="moments" color='primary' :size="46"></u-icon>
				<view class="grid-text">数据汇总</view>
			</u-grid-item>
			<u-grid-item @click="onGridClick(3)">
				<u-icon name="account" color='primary' :size="46"></u-icon>
				<view class="grid-text">个人中心</view>
			</u-grid-item>
		</u-grid>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
			}
		},
		onLoad() {
			this.isLogin()
		},

		methods: {
			async isLogin() {
				//判断缓存中是否登录过，直接登录
				try {
					let resp = await this.$request.get("/user/verify");
					if (resp.data.code != 200) {
						uni.redirectTo({
							url: '../user/login'
						})
						return;
					}
					console.log("已经登录了", resp.data)
				} catch (e) {
					console.log("用户未登录")
				}
			},
			onGridClick(index) {
				switch (index) {
					case 0:
					uni.navigateTo({
						url:'order/order'
					})
						break;
				}
			}
		}
	}
</script>

<style>
	.wrap {
		padding: 20rpx;
	}

	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}
</style>
