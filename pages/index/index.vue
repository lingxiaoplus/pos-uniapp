<template>
	<view>
		<u-navbar :is-back="false" title="pos订单" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }"></u-navbar>
		<view class="content">
		<u-swiper :list="list"></u-swiper>
		<u-grid :col="3">
			<u-grid-item @click="onGridClick(item.url)" class="ripple" v-for="(item,index) in homeList" :key="index">
				<image class="image" :src="item.icon"></image>
				<view class="grid-text">{{item.title}}</view>
			</u-grid-item>
		</u-grid>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			homeList:[
				{
					icon: "../../static/ic_img_3.png",
					title: "订单",
					url: "order/order"
				},
				{
					icon: "../../static/ic_img_4.png",
					title: "日报",
					url: "dailyPaper/dailyPaper"
				},
				/* {
					icon: "../../static/ic_img_6.png",
					title: "数据汇总",
					url: "order/order"
				}, */
				{
					icon: "../../static/ic_img_1.png",
					title: "个人中心",
					url: "personal/personal"
				}
			],
			background: {
				'background-image': 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
			},
			list: [
				{
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
			]
		};
	},
	onLoad() {
		
	},
	mounted() {
		this.isLogin();
	},
	methods: {
		async isLogin() {
			//判断缓存中是否登录过，直接登录
			try {
				let resp = await this.$request.get('/user/verify');
				if (resp.data.code != 200) {
					uni.redirectTo({
						url: '../user/login'
					});
					return;
				}
				console.log('已经登录了', resp.data);
			} catch (e) {
				console.log('用户未登录');
			}
		},
		onGridClick(url) {
			uni.navigateTo({
				url: url
			});
		}
	}
};
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
.image{
	width: 80rpx;
	height: 80rpx;
	margin: 6rpx;
}

.ripple {
    position: relative;
    overflow: hidden;
}

.ripple:after {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(0, 0, 0, .5) 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform .3s, opacity .5s;
}

.ripple:active:after {
    transform: scale(0, 0);
    opacity: .3;
    transition: 0s;
}
</style>
