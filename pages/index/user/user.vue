<template>
	<view>
		<u-navbar back-text="返回" title="人员管理" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }">
			<!-- <view class="slot-wrap">
				<view class="navbar-right" slot="right">
					<view class="right-item">
						<u-icon name="search" color="white" size="32"></u-icon>
						
					</view>
				</view>
			</view> -->
		</u-navbar>
		<!-- <u-sticky offset-top="0">
		</u-sticky> -->
		<view  class="sticky">
			<u-tabs :list="userTypeList" :is-scroll="false" count="userNumbers"
						:current="current" @change="change" name="roleName"></u-tabs>
		</view>
		<u-toast ref="uToast" />
		<view class="content">
		
		
			<wyb-loading ref="loading" :hide-delay="200" loading-type="scale-line" />
			<view v-if="orderList.length < 1" class="u-flex u-col-center u-row-center" style="height: 800rpx;"><u-empty text="人员为空" mode="list"></u-empty></view>

			<view v-for="(user, index) in orderList" :key="user.index" v-else>
				<uni-transition ref="ani" :mode-class="['fade', 'zoom-in']" :duration="500" :show="showAnimation" timingFunction="ease-in-out" :delay="(index + 1) * 100">
					<u-card :show-head="false" :show-foot="false" :border-radius="10" :padding="20" margin="16rpx" box-shadow="0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)">
						<view slot="body" @click="onItemClick(index)">
							<view class="u-body-item-title u-line-2 card-field">
								<view class="card-title">
									昵称
								</view>
								{{ user.nickname }}
							</view>
							<u-divider :use-slot="false" half-width='350'></u-divider>
							
							<view class="u-body-item-title u-line-2 card-field">
								<view class="card-title">
									电话
								</view>
								{{ user.phoneNumber }}
							</view>
							<u-divider :use-slot="false" half-width='350'></u-divider>
							
							<view class="u-body-item-title u-line-2 card-field">
								<view class="card-title">
									用户名
								</view>
								{{ user.username }}
							</view>
							<u-divider :use-slot="false" half-width='350'></u-divider>
							
							<view class="u-body-item-title u-line-2 card-field" v-show="user.roles[0].roleTag=='expatriates'">
								<view class="card-title">
									库存
								</view>
								{{ user.stock }}
							</view>
							<u-divider :use-slot="false" half-width='350' v-show="user.roles[0].roleTag=='expatriates'" ></u-divider>
							
							<view class="u-body-item-title u-line-2 card-field">
								<view class="card-title">
									部门
								</view>
								{{ user.departName }}
							</view>
							<u-divider :use-slot="false" half-width='350'></u-divider>
							
							<view class="u-body-item-title u-line-2 card-field">
								<view class="card-title">
									地址
								</view>
								{{ user.address }}
							</view>
							<u-divider :use-slot="false" half-width='350'></u-divider>
							
							<view class="u-body-item-title u-line-2 card-field" v-show="user.updateAt">
								<view class="card-title">
									最后登录
								</view>
								{{ user.updateAt }}
							</view>
							
							<!-- <u-field v-model="user.nickname" label="昵称" placeholder="" disabled/>
							<u-field v-model="user.phoneNumber" label="电话" placeholder="" disabled/>
							<u-field v-model="user.username" label="用户名" placeholder="" disabled/>
							<u-field v-show="user.roles[0].roleTag=='expatriates'" v-model="user.stock" label="库存" placeholder="" disabled/>
							<u-field v-model="user.departName" label="部门" placeholder="" disabled/>
							<u-field v-show="user.address" v-model="user.address" auto-height	 label="地址" type="textarea" placeholder="" disabled/>
							<u-field v-show="user.updateAt" v-model="user.updateAt" label="最后登录" placeholder="" disabled/>
							 -->
						</view>
					</u-card>
				</uni-transition>
			</view>
			
			<u-loadmore v-if="totalPage > 0" :status="status" />
			<u-action-sheet @click="clickSheet" :list="sheetList" v-model="showSheet"></u-action-sheet>
			<uni-fab :pattern="pattern" :content="btnContent" horizontal="right" vertical="bottom" direction="vertical" @trigger="trigger"></uni-fab>
		</view>
		<u-modal show-cancel-button @confirm="deleteOrder(user.userId)" v-model="showDelete" content="是否删除该用户?"></u-modal>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			current: 0,
			userTypeList: [],
			
			stateList: [],
			orderList: [],
			showSheet: false,
			showSendPop: false,
			showDeptSelect: false,
			departIndex: 0,
			departmentList: [
				{
					name: ''
				}
			],
			showPersonSelect: false,
			personIndex: 0,
			personList: [
				{
					nickname: ''
				}
			],
			sheetList: [
				{
					text: '编辑',
					type: 'edit'
				},
				{
					text: '删除',
					type: 'delete'
				}
			],
			sheetItemNavigation: {
				text: '导航',
				type: 'navigation'
			},
			btnContent: [
				{
					iconPath: '/static/add.png',
					selectedIconPath: '',
					text: '新增人员',
					type: 'add'
				},
				/* {
					iconPath: '/static/search.png',
					selectedIconPath: '',
					text: '搜索人员',
					type: 'search'
				} */
			],
			pattern: {},
			background: getApp().globalData.background,
			pageNum: 1,
			pageSize: 10,
			total: 0,
			totalPage: 0,
			user: '',
			status: 'loadmore',
			userType: '',
			showDelete: false,
			showAnimation: true
		};
	},
	mounted() {
		
		uni.startPullDownRefresh({});
	},
	watch: {
		userType(){
			this.orderList = [];
			this.getOrderList();
		}
	},
	methods: {
		change(index) {
			console.log('变化', index);
			this.current = index;
			this.pageNum = 1;
			this.userType = this.userTypeList[index].roleTag;
		},
		departPicker(index) {
			this.departIndex = index;
		},
		personPicker(index) {
			this.personIndex = index;
		},
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
			uni.setStorageSync('user', this.user);
			switch (this.sheetList[index].type) {
				case 'edit':
					uni.navigateTo({
						url: 'editUser?type=edit',
						events: {
							// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
							refreshOrderList: function(data) {
								that.orderList = [];
								that.getOrderList();
							}
						}
					});
					break;
				case 'delete':
					this.showDelete = true;
					break;
			}
		},
		onItemClick(index) {

			this.user = this.orderList[index];
			console.log("人员: ",this.user)
			this.showSheet = true;
		},
		trigger(item) {
			console.log('fab', item);
			if (item.item.type == 'add') {
				uni.navigateTo({
					url: 'editUser?type=add'
				});
			} else if (item.item.type == 'search') {
				this.showDrawer();
			}
		},
		onReachBottom() {
			if (this.pageNum >= this.totalPage) {
				this.status = 'nomore';
				return;
			}
			this.status = 'loading';
			this.pageNum = this.pageNum + 1;
			this.getOrderList();
		},
		async deleteOrder(id) {
			try {
				this.$refs.loading.showLoading();
				let resp = await this.$request.delete('/user/delete/' + id);
				if (resp.data.code != 200) {
					uni.showToast({
						title: '删除人员失败: ' + resp.data.message,
						icon: 'none'
					});
					return;
				}
				this.pageNum = 1;
				this.orderList = [];
				this.getOrderList();
			} catch (e) {
				console.log('删除人员失败', e);
				uni.showToast({
					title: '删除人员失败，请稍后再试',
					icon: 'none'
				});
			} finally {
				uni.stopPullDownRefresh();
				this.$refs.loading.showLoading();
			}
		},
		async getDepartList() {
			try {
				this.$refs.loading.showLoading();
				let resp = await this.$request.get('/department/list?pageSize=100');
				if (resp.data.code != 200) {
					uni.showToast({
						title: '获取部门失败: ' + resp.data.message,
						icon: 'none'
					});
					return;
				}
				this.departmentList = resp.data.data.data;
				//uni.setStorageSync('departList', this.departmentList);
				this.getPersonList();
				/* let personList = uni.getStorageSync("personList");
				if(personList){
					this.personList = personList;
				}else{
					this.getPersonList();
				} */
			} catch (e) {
				uni.showToast({
					title: '获取部门失败，请稍后再试',
					icon: 'none'
				});
				console.log('获取部门失败', e);
			} finally {
				this.$refs.loading.hideLoading();
			}
		},
		async getPersonList() {
			if (!this.departmentList || this.departmentList.length < 1) {
				uni.showToast({
					title: '请先选择部门',
					icon: 'none'
				});
				return;
			}
			try {
				this.$refs.loading.showLoading();
				let resp = await this.$request.get('/user/list?pageSize=100&departId=' + this.departmentList[this.departIndex].id);
				if (resp.data.code != 200) {
					uni.showToast({
						title: '获取人员失败: ' + resp.data.message,
						icon: 'none'
					});
					return;
				}
				this.personList = resp.data.data.data;
				//uni.setStorageSync('personList', this.personList);
			} catch (e) {
				uni.showToast({
					title: '获取人员失败，请稍后再试',
					icon: 'none'
				});
				console.log('获取人员失败', e);
			} finally {
				this.$refs.loading.hideLoading();
			}
		},
		async getOrderList() {
			try {
				this.$refs.loading.showLoading();
				let resp = await this.$request.get('/user/list?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize+ "&userType=" + this.userType);
				if (resp.data.code != 200) {
					uni.showToast({
						title: '获取人员列表失败: ' + resp.data.message,
						icon: 'none'
					});
					return;
				}
				this.orderList.push(...resp.data.data.data);
				this.totalPage = resp.data.data.totalPage;
				this.total = resp.data.data.total;
				if (this.pageNum >= this.totalPage) {
					this.status = 'nomore';
				}
			} catch (e) {
				uni.showToast({
					title: '获取人员列表失败，请稍后再试',
					icon: 'none'
				});
				console.log('获取人员列表失败', e);
			} finally {
				uni.stopPullDownRefresh();
				this.$refs.loading.hideLoading();
			}
		},
		async getUserTypes() {
			try {
				this.$refs.loading.showLoading();
				let resp = await this.$request.get('/user/role');
				if (resp.data.code != 200) {
					this.$refs.uToast.show({
						title: '获取用户类型失败: ' + resp.data.message,
						icon: false,
						position: 'bottom',
						type: 'fail'
					});
					return;
				}
				this.userTypeList = resp.data.data.data;
				this.userType = this.userTypeList[0].roleTag;
			} catch (e) {
				this.$refs.uToast.show({
					title: '获取用户类型失败，请稍后再试',
					icon: false,
					position: 'bottom',
					type: 'fail'
				});
				console.log('获取用户类型失败', e);
			} finally {
				uni.stopPullDownRefresh();
				this.$refs.loading.hideLoading();
			}
		}
	},
	onPullDownRefresh() {
		this.userTypeList = [];
		this.getUserTypes();
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
.sticky{
	position: sticky;
	top: 0;
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
