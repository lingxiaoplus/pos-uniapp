<template>
	<view>
		<u-navbar back-text="返回" title="日报" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }"></u-navbar>
		<view class="content">
			<wyb-loading ref="loading" :hide-delay="600" loading-type="scale-line"/>
			<view v-if="paperList.length < 1" class="u-flex u-col-center u-row-center" style="height: 800rpx;"><u-empty text="日报为空" mode="list"></u-empty></view>
			<view v-for="(daily,index) in paperList" :key="daily.id" v-else>
				<uni-transition ref="ani" :mode-class="['fade','zoom-in']" :duration="500" :show="showAnimation" timingFunction="ease-in-out" :delay="(index + 1)*100">
				<u-card :title="daily.nickname" :show-head="true" 
				:border-radius="10" :padding="20"  margin="16rpx"
				:sub-title="daily.createAt"
				box-shadow="1rpx 2rpx 2rpx 1rpx #BDBDBD">
					<view slot="body" @click="onItemClick(daily)">
						<u-row gutter="16" justify="center" v-show="daily.roleType=='teleMarketing'">
							<u-col span="6">
								<view class="u-body-item-title u-line-2">总呼出：{{ daily.totalCall }}</view>
							</u-col>
							<u-col span="6">
								<view class="u-body-item-title u-line-2">有效通话：{{ daily.vaildCall }}</view>
							</u-col>
						</u-row>
						<u-row gutter="16" justify="center" v-show="daily.roleType=='teleMarketing'">
							<u-col span="6">
								<view class="u-body-item-title u-line-2">今日意向：{{ daily.target }}</view>
							</u-col>
							<u-col span="6">
								<view class="u-body-item-title u-line-2">激活成功：{{ daily.activeSuccess }}</view>
							</u-col>
						</u-row>
						<u-row gutter="16" justify="center" v-show="daily.roleType=='teleMarketing'">
							<u-col span="6">
								<view class="u-body-item-title u-line-2">当月目标：{{ daily.monthTarget }}</view>
							</u-col>
							<u-col span="6">
								<view class="u-body-item-title u-line-2">总结：{{ daily.summary }}</view>
							</u-col>
						</u-row>
						
						<u-row gutter="16" justify="center" v-show="daily.roleType!='teleMarketing'">
							<u-col span="6">
								<view class="u-body-item-title u-line-2">实际上门：{{ daily.actuallyDoor }}</view>
							</u-col>
							<u-col span="6">
								<view class="u-body-item-title u-line-2">总派单：{{ daily.totalOrder }}</view>
							</u-col>
						</u-row>
						
						<u-row gutter="16" justify="center" v-show="daily.roleType!='teleMarketing'">
							<u-col span="6">
								<view class="u-body-item-title u-line-2">激活成功：{{ daily.activeSuccess }}</view>
							</u-col>
							<u-col span="6">
							</u-col>
						</u-row>
						
					</view>
					<view class="" slot="foot">
						<u-row gutter="16" justify="center">
							<u-col span="6">
								<u-icon name="tags" size="34" color="" :label="daily.roleType=='teleMarketing'?'电销':'外派员'" ></u-icon>
							</u-col>
							<u-col span="6">
								<u-row justify="end">
								<view class="u-body-item-title u-line-2">{{daily.departName}}</view>
								</u-row>
							</u-col>
						</u-row>
					</view>
				</u-card>
				</uni-transition>
			</view>
			<u-loadmore v-if="totalPage > 0" :status="status" />
		</view>
		<uni-fab  horizontal="right" vertical="bottom" direction="vertical" @fabClick="addDailypaper()"></uni-fab>
		
	</view>
</template>

<script>
var scrollTop = 0;
export default {
	data() {
		return {
			background: {
				'background-image': 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
			},
			dailyPaper: {
				userId: '',
				totalCall: '',
				vaildCall: '',
				appointmentVisit: '',
				target: '',
				activeSuccess: '',
				summary: '',
				monthTarget: '',
				actuallyDoor: '',
				totalOrder: '',
				departId: ''
			},
			customStyle: {
				marginTop: '40rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				width: '600rpx',
				marginBottom: '20rpx'
			},
			loading: false,
			paperList: [],
			pageNum: 1,
			pageSize: 10,
			total: 0,
			totalPage: 0,
			status: 'loadmore',
			animationData: {},
			userType: '',
			showAnimation: true
		};
	},
	onPullDownRefresh() {
		this.paperList = [];
		this.getDailyPaperList();
	},
	onLoad() {
		let user = uni.getStorageSync("user_info")
		this.userType = user.roles[0].roleTag;
		uni.startPullDownRefresh();
	},
	onPageScroll(e) {
		/* if (scrollTop > e.scrollTop + 100) {
			console.log('向上滑动');
		} else if (scrollTop < e.scrollTop + 100) {
			console.log('向下滑动');
			this.hideButton()
		}
		scrollTop = e.scrollTop; */
	},
	methods: {
		async getDailyPaperList() {
			try {
				this.status = 'loading';
				this.$refs.loading.showLoading()
				let resp = await this.$request.get('/dailyPaper/list?pageNum=' + this.pageNum + '&pageSize=' + this.pageSize+ "&userType=" + this.userType);
				if (resp.data.code != 200) {
					return;
				}
				this.paperList.push(...resp.data.data.data);
				this.totalPage = resp.data.data.totalPage;
				this.total = resp.data.data.total;
				if (this.pageNum >= this.totalPage) {
					this.status = 'nomore';
				}
			} catch (e) {
				console.log('订单状态失败', e);
			} finally {
				uni.stopPullDownRefresh();
				this.$refs.loading.hideLoading()
			}
		},
		onReachBottom() {
			if (this.pageNum >= this.totalPage) {
				this.status = 'nomore';
				return;
			}
			this.status = 'loading';
			this.pageNum = this.pageNum + 1;
			this.getDailyPaperList();
		},
		addDailypaper() {
			var that = this;
			uni.navigateTo({
				url: 'editDailyPaper',
				events: {
				    // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
				    refreshList: function(data) {
						that.paperList = [];
						that.getDailyPaperList();
				      console.log("刷新order list",data)
				    }
				  },
			});
		},
		showButton() {
			var animation = uni.createAnimation({
				duration: 1000,
				timingFunction: 'linear'
			});
			animation.scale(1, 1).step();
			this.animationData = animation.export();
		},
		hideButton() {
			var animation = uni.createAnimation({
				duration: 1000,
				timingFunction: 'linear'
			});
			//animation.scale(0, 0).step();
			//this.animationData = animation.export();
			animation.translate(30).step()
			 this.animationData = animation.export()
		},
		onItemClick(dailyPaper){
			
		}
	}
};
</script>

<style></style>
