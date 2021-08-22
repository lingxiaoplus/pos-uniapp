<template>
	<view>
		<u-navbar back-text="返回" title="设备管理" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }">
			
		</u-navbar>
		<view class="u-margin-20">
			<u-sticky offset-top="0">
				<u-search placeholder="请输入机器码搜索" v-model="keyword" shape="square" @custom="search()" @search="search">
					
				</u-search>
			</u-sticky>
			
		</view>
		<u-toast ref="uToast" />
		<wyb-loading ref="loading" :hide-delay="100" loading-type="scale-line" />
		
		<view class="content wrap">
			<view v-for="(device, index) in deviceList" :key="index">
				<uni-transition ref="ani" :mode-class="['fade', 'zoom-in']" :duration="500" :show="showAnimation" timingFunction="ease-in-out" :delay="(index + 1) * 100">
					<u-card :show-head="false" :show-foot="false" :border-radius="10" :padding="20" margin="16rpx" box-shadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)">
						<view slot="body" @click="onItemClick(index)">
							<view class="u-body-item-title u-line-2 card-field">
								<view class="card-title">
									品牌
								</view>
								{{ device.brand }}
							</view>
							<u-divider :use-slot="false" half-width='350'></u-divider>
							
							<view class="u-body-item-title u-line-2 card-field">
								<view class="card-title">
									部门
								</view>
								{{ device.departName }}
							</view>
							<u-divider :use-slot="false" half-width='350'></u-divider>
							
							<view class="u-body-item-title u-line-2 card-field">
								<view class="card-title">
									押金
								</view>
								{{ device.deposit }}
							</view>
							<u-divider :use-slot="false" half-width='350'></u-divider>
							<view class="u-body-item-title u-line-2 card-field">
								<view class="card-title">
									状态
								</view>
								<u-tag :type="device.orderId ? 'info':'success'"  mode="light" :text="device.orderId ? '已使用' : '未使用'">
									
								</u-tag>
							</view>
							<u-divider :use-slot="false" half-width='350'></u-divider>
							<view class="u-body-item-title u-line-2 card-field">
								<view class="card-title">
									机器码
								</view>
								{{ device.deviceNo }}
							</view>
							
						</view>
					</u-card>
				</uni-transition>
			</view>
			<u-loadmore v-if="totalPage > 0" :status="status" />
			
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: getApp().globalData.background,
				keyword: '',
				current: 0,
				pageNum: 1,
				pageSize: 10,
				totalPage: 0,
				total: 0,
				status: 'loadmore',
				typeList: [
					{
						name: '未使用',
						value: '0'
					},
					{
						name: '已使用',
						value: '1'
					}
				],
				deviceList: [],
				showAnimation: true,
				pageType: '',
			}
		},
		methods: {
			change(index) {
				console.log('变化', index);
				this.current = index;
				this.pageNum = 1;
				//this.type = this.userTypeList[index].roleTag;
			},
			async getDeviceList() {
				try {
					this.$refs.loading.showLoading();
					let resp = await this.$request.post('/devices/list/condition',{
						data:{
							keyWord: this.keyword,
							pageNum: this.pageNum,
							pageSize: this.pageSize
						}
					});
					if (resp.data.code != 200) {
						this.$refs.uToast.show({
							title: '获取设备列表失败: ' + resp.data.message,
							icon: false,
							position: 'bottom',
							type: 'fail'
						});
						return;
					}
					this.deviceList.push(...resp.data.data.data);
					this.totalPage = resp.data.data.totalPage;
					this.total = resp.data.data.total;
					if (this.pageNum >= this.totalPage) {
						this.status = 'nomore';
					}
				} catch (e) {
					this.$refs.uToast.show({
						title: '获取设备列表失败，请稍后再试',
						icon: false,
						position: 'bottom',
						type: 'fail'
					});
					console.log('获取设备列表失败', e);
				} finally {
					uni.stopPullDownRefresh();
					this.$refs.loading.hideLoading();
				}
			},
			onReachBottom() {
				if (this.pageNum >= this.totalPage) {
					this.status = 'nomore';
					return;
				}
				this.status = 'loading';
				this.pageNum = this.pageNum + 1;
				this.getDeviceList();
			},
			search(value){
				this.deviceList = [];
				this.pageNum = 1;
				this.getDeviceList()
			},
			onItemClick(index){
				if(this.pageType !== 'editOrder'){
					return
				}
				//跳转回去
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.emit('getDeviceNo', { deviceNo: this.deviceList[index].deviceNo });
				uni.navigateBack({});
			}
		},
		mounted() {
			uni.startPullDownRefresh({
			})
		},
		onLoad(argument) {
			let type = argument.type;
			if(type){
				this.pageType = type;
			}
		},
		onPullDownRefresh() {
			this.deviceList = [];
			this.getDeviceList()
		}
	}
</script>

<style>
.wrap {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top) - 68px);
	width: 100%;
}
.slot-wrap {
	display: flex;
	align-items: center;

	/* 如果您想让slot内容占满整个导航栏的宽度 */
	/* flex: 1; */
	/* 如果您想让slot内容与导航栏左右有空隙 */
	/* padding: 0 30rpx; */
}
.right-item {
	margin: 0 12rpx;
	position: relative;
	color: #ffffff;
	display: flex;
}
.navbar-right {
	margin-right: 24rpx;
	display: flex;
}
.card-title{
	width: 140rpx;
}
.card-field{
	font-size: 14px;
	padding: 12rpx;
	margin: 4rpx;
	text-align: left;
	position: flex;
	flex-direction: row;
	color: #303133;
}
</style>
