<template>
	<view>
		<u-navbar back-text="返回" title="选择地点" :background="background" 
		title-color="#fff" back-icon-color="#ffffff"  :back-text-style="{color: '#fff'}"></u-navbar>
		
		<view class="page-body">
			<view class="page-section page-section-gap"><map style="width: 100%; height: 1000rpx;" 
			:latitude="latitude" :longitude="longitude" 
			:markers="covers"></map></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return { 
			background: getApp().globalData.background,
			id: 0, // 使用 marker点击事件 需要填写id
			title: 'map',
			latitude: 39.909,
			longitude: 116.39742,
			covers: [
				{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../../static/location.png'
				},
				{
					latitude: 39.9,
					longitude: 116.39,
					iconPath: '../../../static/location.png'
				}
			]
		};
	},
	onLoad() {
		uni.getLocation({
		    type: 'gcj02',
		    success: function (res) {
		        console.log('当前位置的经度：' + res.longitude);
		        console.log('当前位置的纬度：' + res.latitude);
				this.latitude = res.latitude;
				this.longitude = res.longitude;
		    }
		});
	},
	methods: {
		
	}
};
</script>

<style></style>
