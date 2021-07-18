<template>
	<view>
		<u-navbar back-text="返回" title="订单" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }">
			<!-- <view class="slot-wrap">
				<view class="navbar-right" slot="right">
					<view class="right-item">
						<u-icon name="search" color="white" size="32"></u-icon>
						
					</view>
				</view>
			</view> -->
		</u-navbar>
		<view class="content">
			<u-tabs :list="stateList" :is-scroll="true" :current="current" @change="change" overflow-count="9000"></u-tabs>
			<view v-if="orderList.length < 1" class="u-flex u-col-center u-row-center" style="height: 800rpx;">
				<u-empty text="订单为空" mode="list"></u-empty>
			</view>
			
			<view v-for="order in orderList" :key="order.id" v-else>
				<u-card :show-head="false" :show-foot="false" :border-radius="10" :padding="20" margin="16rpx" box-shadow="2rpx 2rpx 1rpx #BDBDBD">
					<view slot="body" @click="onItemClick(order)">
						<view class="u-body-item-title u-line-2">用户姓名：{{ order.username }}</view>
						<view class="u-body-item-title u-line-2">用户电话：{{ order.phone }}</view>
						<view class="u-body-item-title u-line-2">营销时间：{{ order.createAt }}</view>
						<view class="u-body-item-title u-line-2">预约时间：{{ order.outboundAt }}</view>
						<view class="u-body-item-title u-line-2">外派：{{ order.expatriatesUser ? order.expatriatesUser.nickname : '' }}</view>
						<view class="u-body-item-title u-line-2">地址：{{ order.address }}</view>
					</view>
				</u-card>
			</view>
			<uni-drawer ref="showRight" mode="right" :mask-click="false">
				<scroll-view style="height: 100%;" scroll-y="true">
					<view style="height: 140rpx;"></view>
					<u-field class="u-margin-top-40" v-model="queryParams.username" maxlength="11" label="姓名" placeholder="请输入姓名"></u-field>
					<u-field v-model="queryParams.phone" maxlength="11" label="电话" placeholder="请输入电话"></u-field>
					<u-field v-model="queryParams.address" maxlength="120" label="地址" placeholder="请输入地址"></u-field>
					<u-field v-model="queryParams.back" maxlength="20" label="银行" placeholder="请输入银行"></u-field>
					<!-- <u-field maxlength="20" label="部门" :disabled="true" right-icon="arrow-down-fill" placeholder="请输入部门">
					</u-field> -->

					<u-row justify="center" class="u-margin-20">
						<u-col span="6"><u-button type="info" shape="circle" :plain="true" :ripple="true" @click="closeDrawer('cancel')">取消</u-button></u-col>
						<u-col span="6"><u-button type="primary" shape="circle" :plain="true" :ripple="true" @click="closeDrawer('confirm')">确认</u-button></u-col>
					</u-row>
				</scroll-view>
			</uni-drawer>
			<u-loadmore v-if="totalPage > 0" :status="status" />
			<u-action-sheet @click="clickSheet" :list="sheetList" v-model="showSheet"></u-action-sheet>
			<uni-fab :pattern="pattern" :content="btnContent" horizontal="right" vertical="bottom" direction="vertical" @trigger="trigger"></uni-fab>
		</view>
		<u-modal show-cancel-button @confirm="deleteOrder(order.id)" v-model="showDelete" content="是否删除该订单?">
			
		</u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			stateList: [],
			orderList: [],
			showSheet: false,
			sheetList: [
				{
					text: '派单',
					color: 'blue',
					type: 'send'
				},
				{
					text: '编辑',
					type: 'edit'
				},
				{
					text: '详情',
					type: 'view'
				},
				{
					text: '删除',
					type: 'delete'
				}
			],
			sheetItemNavigation:{
				text: '导航',
				type: 'navigation'
			},
			btnContent: [
				{
					iconPath: '/static/add.png',
					selectedIconPath: '',
					text: '新建订单',
					type: 'add'
				},
				{
					iconPath: '/static/search.png',
					selectedIconPath: '',
					text: '搜索订单',
					type: 'search'
				}
			],
			pattern: {},
			current: 0,
			background: {
				'background-image': 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
			},
			queryParams: {
				pageNum: 1,
				pageSize: 20,
				state: 'order_status_init',
				username: '',
				phone: '',
				address: '',
				back: '',
				deleted: false
			},
			order: '',
			total: 0,
			totalPage: 0,
			status: 'loadmore',
			userType: '',
			showDelete: false,
		};
	},
	mounted() {
		let user = uni.getStorageSync('user_info');
		this.userType = user.roles[0].roleTag;
		if (this.userType === 'teleMarketing') {
			this.sheetList.shift();
		} else if (this.userType === 'expatriates') {
			this.btnContent.shift();
			this.queryParams.state = 'order_status_out_init';
			this.sheetList.shift();
			this.sheetList.pop();
			this.sheetList.push(this.sheetItemNavigation)
		}else{
			this.sheetList.push(this.sheetItemNavigation)
		}
		uni.startPullDownRefresh({
			
		})
	},
	methods: {
		showDrawer() {
			this.$refs.showRight.open();
		},
		closeDrawer(type) {
			this.$refs.showRight.close();
			if (type === 'confirm') {
				this.stateList = [];
				uni.startPullDownRefresh();
			}
		},
		clickSheet(index) {
			var that = this;
			uni.setStorageSync('order', this.order);
			switch (this.sheetList[index].type) {
				case 'edit':
					uni.navigateTo({
						url: 'editOrder?type=edit',
						events: {
						    // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
						    refreshOrderList: function(data) {
								that.orderList = [];
								that.getOrderList()
						      console.log("刷新order list",data)
						    }
						  },
					});
					break;
				case 'view':
					uni.navigateTo({
						url: 'editOrder?type=view'
					});
					break;
				case 'send':
					
					break;
				case 'delete':
					this.showDelete = true;
					break;
				case 'navigation':
					uni.openLocation({
					            latitude: this.order.latitude,
					            longitude: this.order.longitude,
								address: this.order.address,
					            success: function () {
					                console.log('success');
					            }, 
								fail(e) {
									console.log('fail',e);
									uni.showToast({
										title:'打开地图失败: ' + e.errMsg,
										icon:'none'
									})
								}
					});
					break;
			}
		},
		onItemClick(order) {
			this.showSheet = true;
			this.order = order;
		},
		change(index) {
			console.log('变化', index);
			this.current = index;
			this.queryParams.state = this.stateList[index].code;
			this.orderList = [];
			this.getOrderList();
		},
		trigger(item) {
			console.log('fab', item);
			if (item.item.type == 'add') {
				uni.navigateTo({
					url: 'editOrder?type=add'
				});
			} else if (item.item.type == 'search') {
				this.showDrawer();
			}
		},
		onReachBottom() {
			if (this.queryParams.pageNum >= this.totalPage) {
				this.status = 'nomore';
				return;
			}
			this.status = 'loading';
			this.queryParams.pageNum = this.queryParams.pageNum + 1;
			this.getOrderList();
		},
		async deleteOrder(id) {
			try {
				uni.showLoading({});
				let resp = await this.$request.delete('/order/' + id);
				if (resp.data.code != 200) {
					uni.showToast({
						title:"获取订单失败: " + resp.data.message,
						icon:'none'
					})
					return;
				}
				this.orderList = [];
				this.getOrderList()
			} catch (e) {
				console.log('删除订单失败', e);
				uni.showToast({
					title:"删除订单失败，请稍后再试",
					icon:'none'
				})
			} finally {
				uni.stopPullDownRefresh();
				uni.hideLoading();
			}
		},
		async getOrderList() {
			try {
				uni.showLoading({});
				let resp = await this.$request.post('/order/list', {
					data: this.queryParams
				});
				if (resp.data.code != 200) {
					uni.showToast({
						title:"获取订单失败: " + resp.data.message,
						icon:'none'
					})
					return;
				}
				this.orderList.push(...resp.data.data.data);
				if (this.stateList.length < 1) {
					this.stateList = resp.data.data.stateList;
					if (this.userType === 'expatriates') {
						this.stateList.shift();
					}
					uni.setStorageSync('stateList', this.stateList);
				}
				this.totalPage = resp.data.data.totalPage;
				this.total = resp.data.data.total;
				if (this.queryParams.pageNum >= this.totalPage) {
					this.status = 'nomore';
				}
			} catch (e) {
				uni.showToast({
					title:"获取订单失败，请稍后再试",
					icon:'none'
				})
				console.log('订单状态失败', e);
			} finally {
				uni.stopPullDownRefresh();
				uni.hideLoading();
			}
		}
	},
	onPullDownRefresh() {
		this.orderList = [];
		this.getOrderList();
	}
};
</script>

<style lang="scss" scoped>
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
</style>
