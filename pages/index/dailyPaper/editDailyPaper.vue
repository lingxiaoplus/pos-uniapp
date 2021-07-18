<template>
	<view>
		<u-top-tips ref="uTips"></u-top-tips>
		<u-navbar back-text="返回" title="编辑日报" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }"></u-navbar>
		<view class="content u-margin-20">
			<u-form :model="dailyPaper" ref="uForm">
				<u-form-item label-width="160rpx" label="部门名称" v-if="showExpatriates" required>
					<u-input v-model="departName" type="select" @click="showDepartList = true" placeholder="请选择部门" />
					<u-picker mode="selector" :default-selector="[0]" range-key="name" :range="departList" v-model="showDepartList" @confirm="departClick"></u-picker>
				</u-form-item>
				
				<u-form-item label-width="160rpx" label="总呼出" prop="totalCall" v-if="showTeleMarketing" required><u-input type="number" v-model="dailyPaper.totalCall" placeholder="请输入总呼出数量" /></u-form-item>
				<u-form-item label-width="160rpx" label="有效通话" prop="vaildCall" v-if="showTeleMarketing" required><u-input type="number" v-model="dailyPaper.vaildCall" placeholder="请输入有效通话数量" /></u-form-item>
				<u-form-item label-width="160rpx" label="今日意向" prop="target" v-if="showTeleMarketing" required><u-input type="number" v-model="dailyPaper.target" placeholder="请输入今日意向数量" /></u-form-item>
				<u-form-item label-width="160rpx" label="激活成功" prop="activeSuccess" required><u-input type="number" v-model="dailyPaper.activeSuccess" placeholder="请输入激活成功数量" /></u-form-item>
				<u-form-item label-width="160rpx" label="当月目标" prop="monthTarget" v-if="showTeleMarketing" required><u-input type="number" v-model="dailyPaper.monthTarget" placeholder="请输入当月目标数量" /></u-form-item>
				<u-form-item label-width="160rpx" label="总结" prop="summary" v-if="showTeleMarketing" required><u-input type="textarea" v-model="dailyPaper.summary" placeholder="请输入总结" /></u-form-item>
				
				
				<u-form-item label-width="160rpx" label="实际上门" prop="actuallyDoor" v-if="showExpatriates" required><u-input type="number" v-model="dailyPaper.actuallyDoor" placeholder="请输入实际上门" /></u-form-item>
				<u-form-item label-width="160rpx" label="总派单" prop="totalOrder" v-if="showExpatriates" required><u-input type="number" v-model="dailyPaper.totalOrder" placeholder="请输入总派单" /></u-form-item>
				
				<u-button :custom-style="customStyle" type="primary" :ripple="true" @click="save()" :loading="loading">提交</u-button>
			</u-form>
		</view>
	</view>
</template>

<script>
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
			departName: '',
			showTeleMarketing: true,
			showExpatriates: false,
			showDepartList: false,
			departIndex: 0,
			departList: [],
			rules: {
				totalCall: [
					{
						required: true,
						message: '请输入总呼出数量',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur'],
						
					}
				],
				vaildCall: [
					{
						required: true,
						message: '请输入有效通话数量',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur'],
						
					}
				],
				target: [
					{
						required: true,
						message: '请输入今日意向数量',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur'],
						
					}
				],
				activeSuccess: [
					{
						required: true,
						message: '请输入激活成功数量',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				monthTarget: [
					{
						required: true,
						message: '请输入当月目标数量',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				summary: [
					{
						required: true,
						message: '请输入总结',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				actuallyDoor: [
					{
						required: false,
						message: '请输入实际上门',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				totalOrder: [
					{
						required: false,
						message: '请输入总派单',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
			},
			customStyle: {
				marginTop: '40rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				width: '600rpx',
				marginBottom: '20rpx'
			},
			loading: false,
			user: '',
		};
	},
	mounted() {
		
	},
	onReady() {
		let user = uni.getStorageSync("user_info")
		let userType = user.roles[0].roleTag;
		this.user = user;
		this.dailyPaper.departId = this.user.departId
		if(userType === 'teleMarketing'){
			this.showTeleMarketing = true;
			this.showExpatriates = false;
		}else if (userType === 'expatriates'){
			this.showTeleMarketing = false;
			this.showExpatriates = true;
			this.rules.totalCall[0].required = false;
			this.rules.vaildCall[0].required = false;
			this.rules.target[0].required = false;
			this.rules.monthTarget[0].required = false;
			this.rules.summary[0].required = false;
			
			
			this.rules.actuallyDoor[0].required = true;
			this.rules.totalOrder[0].required = true;
			this.getDepartList()
		}
		//this.$refs.uForm.setRules(this.rules);  小程序不好用
		this.getTodayDailyPaper();
	},
	methods: {
		departClick(index){
			this.departIndex = index;
			this.dailyPaper.departId = this.departList[index].id;
			this.departName = this.departList[index].name;
		},
		save() {
			var that = this;
			/* this.$refs.uForm.validate(valid => {
				if (valid) {
					that.addDailyPaper()
				} else {
					console.log('验证失败');
				}
			}); */
			if(this.showTeleMarketing){
				if(!this.dailyPaper.totalCall){
					this.$refs.uTips.show({
									title: '请输入总呼出数量',
									type: 'warning',
									duration: '1500'
					})
					return;
				}
				if(!this.dailyPaper.vaildCall){
					
					this.$refs.uTips.show({
									title: '请输入有效通话数量',
									type: 'warning',
									duration: '1500'
					})
					return;
				}
				if(!this.dailyPaper.target){
					this.$refs.uTips.show({
									title: '请输入今日意向数量',
									type: 'warning',
									duration: '1500'
					})
					ret
					return;
				}
				if(!this.dailyPaper.monthTarget){
					this.$refs.uTips.show({
									title: '请输入当月目标数量',
									type: 'warning',
									duration: '1500'
					})
					ret
					return;
				}
				if(!this.dailyPaper.summary){
					this.$refs.uTips.show({
									title: '请输入总结',
									type: 'warning',
									duration: '1500'
					})
					ret
					return;
				}
			}
			
			if(!this.dailyPaper.activeSuccess){
				this.$refs.uTips.show({
								title: '请输入激活成功数量',
								type: 'warning',
								duration: '1500'
				})
				ret
				return;
			}
			if(this.showExpatriates){
				if(!this.dailyPaper.actuallyDoor){
					this.$refs.uTips.show({
									title: '请输入实际上门',
									type: 'warning',
									duration: '1500'
					})
					ret
					return;
				}
				if(!this.dailyPaper.totalOrder){
					this.$refs.uTips.show({
									title: '请输入总派单',
									type: 'warning',
									duration: '1500'
					})
					ret
					return;
				}
			}
			
			this.addDailyPaper()
		},
		async getTodayDailyPaper() {
			try {
				this.loading = true;
				uni.showLoading({});
				let departId = this.dailyPaper.departId;
				let url = "/dailyPaper?userId=" + this.user.userId;
				if(departId && departId.length > 0){
					url = url + "&departId=" + departId;
				}
				let resp = await this.$request.get(url);
				if (resp.data.code != 200) {
					return;
				}
				this.dailyPaper = resp.data.data;
				this.dailyPaper.departId = departId;
				console.log("获取当天日报",this.dailyPaper)
			} catch (e) {
				console.log('获取当天日报失败', e);
			} finally {
				uni.stopPullDownRefresh();
				uni.hideLoading();
				this.loading = false;
			}
		},
		async addDailyPaper() {
			try {
				this.loading = true;
				uni.showLoading({});
				this.dailyPaper.userId = this.user.userId;
				let resp = await this.$request.post('/dailyPaper',{
					data:this.dailyPaper
				});
				if (resp.data.code != 200) {
					uni.showToast({
						title:"提交日报失败: " + resp.data.message,
						icon:'none'
					})
					return;
				}
				uni.showToast({
					title:"提交日报成功",
				})
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('refreshList', {data: '刷新界面'});
				uni.navigateBack({
					
				})
			} catch (e) {
				uni.showToast({
					title:"提交日报失败，请稍后再试",
					icon:'none'
				})
				console.log('添加日报', e);
			} finally {
				uni.stopPullDownRefresh();
				uni.hideLoading();
				this.loading = false;
			}
		},
		async getDepartList() {
			try {
				this.loading = true;
				uni.showLoading({});
				let resp = await this.$request.get('/department/list?pageNum=1&pageSize=999');
				if (resp.data.code != 200) {
					return;
				}
				

				this.departList = resp.data.data.data.filter(item=>{
					return item.id != this.user.departId
				});
				this.dailyPaper.departId = this.departList[0].id;
				this.departName = this.departList[0].name;
			} catch (e) {
				console.log('添加日报', e);
			} finally {
				uni.stopPullDownRefresh();
				uni.hideLoading();
				this.loading = false;
			}
		},
	}
};
</script>

<style></style>
