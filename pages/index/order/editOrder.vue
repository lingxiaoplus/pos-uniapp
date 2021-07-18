<template>
	<view>
		<u-navbar back-text="返回" :title="title" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }"></u-navbar>
		<view class="content u-margin-20">
			<u-form :model="form" ref="uForm">
				<u-form-item label-width="160rpx" label="客户姓名" prop="username" required><u-input v-model="form.username" placeholder="请输入客户姓名" /></u-form-item>
				<u-form-item label-width="160rpx" label="客户电话" prop="phone" required><u-input v-model="form.phone" maxlength="11" type="number" placeholder="请输入客户电话" /></u-form-item>
				<u-form-item label-width="160rpx" label="银行" prop="back" required><u-input v-model="form.back" placeholder="请输入银行" /></u-form-item>
				<u-form-item label-width="160rpx" label="外访地址" prop="address" required>
					<u-input type="textarea" v-model="form.address" placeholder="请输入外访地址"></u-input>
					<u-button size="mini" type="primary" @click="openMap()">地图选址</u-button>
				</u-form-item>
				<u-form-item label-width="160rpx" label="订单状态" required>
					<u-input v-model="form.stateName" type="select" @click="showStatusList = true" placeholder="请选择订单状态" />
					<u-picker mode="selector" :default-selector="[0]" range-key="name" :range="stateList" v-model="showStatusList" @confirm="orderStateClick"></u-picker>
				</u-form-item>
				<u-form-item label-width="160rpx" label="预约时间" prop="outboundAt" required>
					<u-input v-model="form.outboundAt" type="select" @click="showTimeSelect = true" placeholder="请选择预约时间" />
					<u-picker mode="time" v-model="showTimeSelect" :params="timeParams" @confirm="outboundConfirm"></u-picker>
				</u-form-item>
				<u-form-item label-width="160rpx" label="收取押金"><u-switch slot="right" v-model="showMoneySwitch"></u-switch></u-form-item>
				<u-form-item label-width="160rpx" label="押金" v-if="showMoneySwitch"><u-input v-model="form.money" placeholder="请输入押金" /></u-form-item>
				<u-form-item label-width="160rpx" label="品牌"><u-input v-model="form.brant" placeholder="请输入品牌" /></u-form-item>
				<u-form-item label-width="160rpx" label="机器码"><u-input v-model="form.machineCode" placeholder="请输入机器码" /></u-form-item>
				<u-form-item label-width="160rpx" label="反馈" required><u-input type="textarea" v-model="form.feedBack" placeholder="请输入初步预约时间以及和客户沟通情况" /></u-form-item>
				<u-form-item label-width="160rpx" label="上传图片" required v-if="form.state == 'order_status_out_success' || form.state == 'order_status_out_fail'">
					<u-upload :max-count="maxCount" :show-progress="false" :deletable="deletable" :action="action" :file-list="form.resourceList"></u-upload>
				</u-form-item>
				<u-button v-if="pageType != 'view'" :custom-style="customStyle" type="primary" :ripple="true" @click="save()" :loading="loading">提交</u-button>
			</u-form>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			background: getApp().globalData.background,
			form: {
				username: '',
				phone: '',
				back: '',
				money: '',
				state: '',
				stateName: '',
				address: '',
				longitude: '',
				latitude: '',
				returnAt: '',
				sendTo: '',
				outboundAt: '',
				takenMode: '',
				remark: '',
				feedBack: '',
				departId: '',
				machineCode: '',
				brant: '',
				resourceList: [],
				longitude: '',
				latitude: ''
			},
			rules: {
				username: [
					{
						required: true,
						message: '请输入客户姓名',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				phone: [
					{
						required: true,
						message: '请输入客户电话',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				back: [
					{
						required: true,
						message: '请输入银行',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				address: [
					{
						required: true,
						message: '请输入外访地址',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
				outboundAt: [
					{
						required: true,
						message: '请选择预约时间',
						// 可以单个或者同时写两个触发验证方式
						trigger: ['change', 'blur']
					}
				],
			},
			showStatusList: false,
			showTimeSelect: false,
			loading: false,
			maxCount: '10',
			deletable: true,
			pageType: '',
			timeParams: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true,
				second: false
			},
			showMoneySwitch: false,
			stateIndex: -1,
			stateList: [],
			customStyle: {
				marginTop: '40rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
				width: '600rpx',
				marginBottom: '20rpx'
			},
			action: 'http://test.pos.yinqkj.cn/file'
		};
	},
	
	watch: {
		stateIndex(value) {
			this.form.state = this.stateList[value].code;
			this.form.stateName = this.stateList[value].name;
		},
		showMoneySwitch(value){
			if(value){
				this.form.money = 299
			}else{
				this.form.money = ''
			}
		}
	},
	mounted() {
		
		let list = uni.getStorageSync('stateList');
		if (list) {
			this.stateList = list;
		}
		
		if (this.pageType == 'view') {
			this.maxCount = this.form.resourceList.length;
			this.deletable = false;
			this.title = '查看订单';
		} else if (this.pageType == 'edit') {
			this.title = '编辑订单';
		} else {
			this.title = '新增订单';
			this.stateIndex = 0;
			uni.removeStorageSync('order');
		}
		
		let form = uni.getStorageSync('order');
		if (form) {
			this.form = form;
			this.form.resourceList.forEach(item => {
				item.url =
					item.path +
					'?imageMogr2/thumbnail/720x/interlace/1|watermark/2/text/6ZO25Lm-56eR5oqA/font/bXN5aGJkLnR0Zg/fontsize/14/fill/IzY2NjY2Ng/dissolve/80/gravity/southeast/dx/10/dy/10';
			});
			if(form.money){
				this.showMoneySwitch = true;
			}
		}
		let user = uni.getStorageSync("user_info")
		this.form.departId = user.departId;
	},
	onLoad(argument) {
		let type = argument.type;
		this.pageType = type;
	},
	// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		openMap() {
			var that = this;
			//#ifndef H5 || APP-PLUS
			uni.authorize({
			    scope: 'scope.userLocation',
			    success() {
			        uni.chooseLocation({
			        	success: function(res) {
			        		console.log('位置名称：' + res.name);
			        		console.log('详细地址：' + res.address);
			        		console.log('纬度：' + res.latitude);
			        		console.log('经度：' + res.longitude);
			        		that.form.address = res.address;
			        		that.form.longitude = res.longitude;
			        		that.form.latitude = res.latitude;
			        	}
			        });
			    }
			})
			//#endif
			
			//#ifdef H5 || APP-PLUS
			uni.chooseLocation({
				success: function(res) {
					console.log('位置名称：' + res.name);
					console.log('详细地址：' + res.address);
					console.log('纬度：' + res.latitude);
					console.log('经度：' + res.longitude);
					that.form.address = res.address;
					that.form.longitude = res.longitude;
					that.form.latitude = res.latitude;
				}
			});
			//#endif
			/* uni.navigateTo({
				url:'../../map/map'
			}) */
		},
		orderStateClick(index) {
			this.stateIndex = index;
		},
		outboundConfirm(date) {
			let outboundDate = date.year + '-' + date.month + '-' + date.day + ' ' + date.hour + ':' + date.minute + ':00';
			this.form.outboundAt = outboundDate;
		},
		save() {
			var that = this;
			this.$refs.uForm.validate(valid => {
				if (valid) {
					console.log('验证通过');
					if(that.pageType == 'add'){
						that.createOrder()
					}else if(that.pageType == 'edit'){
						that.updateOrder()
					}
				} else {
					console.log('验证失败');
				}
			});
		},
		async createOrder() {
			try {
				uni.showLoading({
					title:"提交订单中..."
				})
				let resp = await this.$request.post('/order', {
					data: this.form
				});
				if (resp.data.code != 200) {
					uni.showToast({
						title:"提交订单失败: " + resp.data.message,
						icon:'none'
					})
					return;
				}
				uni.showToast({
					title:"提交订单成功",
				})
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('refreshOrderList', {data: '刷新界面'});
				uni.navigateBack({
					
				})
			} catch (e) {
				uni.showToast({
					title:"提交订单失败, 请稍后再试",
					icon:'none'
				})
			}finally{
				uni.hideLoading()
			}
		},
		async updateOrder(){
			try {
				uni.showLoading({
					title:"提交订单中..."
				})
				let resp = await this.$request.put('/order', {
					data: this.form
				});
				if (resp.data.code != 200) {
					uni.showToast({
						title:"提交订单失败: " + resp.data.message,
						icon:'none'
					})
					return;
				}
				uni.showToast({
					title:"提交订单成功",
				})
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('refreshOrderList', {data: '刷新界面'});
				uni.navigateBack({
					
				})
			} catch (e) {
				uni.showToast({
					title:"提交订单失败, 请稍后再试",
					icon:'none'
				})
			}finally{
				uni.hideLoading()
			}
		}
	}
};
</script>

<style></style>
