<template>
	<view>
		<u-navbar back-text="返回" :title="title" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }"></u-navbar>
		<wyb-loading ref="loading" :hide-delay="100" loading-type="scale-line" />
		<view class="content u-margin-20">
			<u-form :model="form" ref="uForm">
				<u-form-item label-width="160rpx" label="客户姓名" prop="username" required><u-input v-model="form.username" placeholder="请输入客户姓名" /></u-form-item>
				<u-form-item label-width="160rpx" label="客户电话" prop="phone" required>
					<u-input v-model="form.phone" maxlength="11" type="number" placeholder="请输入客户电话" />
				</u-form-item>
				<u-form-item label-width="160rpx" label="银行" prop="back" required>
					<u-input v-model="form.back" placeholder="请输入银行" type="select" @click="showBankSelect = true" />
					<u-picker mode="selector" range-key="name" :range="bankList" v-model="showBankSelect" @confirm="bankConfirm"></u-picker>
				</u-form-item>
				<u-form-item label-width="160rpx" label="外访地址" prop="address" required>
					<u-input type="textarea" v-model="form.address" placeholder="请输入外访地址"></u-input>
					<u-button plain size="mini" type="success" @click="openMap()">地图选址</u-button>
				</u-form-item>
				<u-form-item label-width="160rpx" label="订单状态" required>
					<u-input v-model="form.stateName" type="select" @click="showStatusList = true" placeholder="请选择订单状态" />
					<u-picker mode="selector" :default-selector="[0]" range-key="name" :range="stateList" v-model="showStatusList" @confirm="orderStateClick"></u-picker>
				</u-form-item>
				<u-form-item label-width="160rpx" label="预约时间" prop="outboundAt" required>
					<u-input v-model="form.outboundAt" type="select" @click="showTimeSelect = true" placeholder="请选择预约时间" />
					<u-picker mode="time" v-model="showTimeSelect" :params="timeParams" @confirm="outboundConfirm"></u-picker>
				</u-form-item>
				<!-- <u-form-item label-width="160rpx" label="收取押金"><u-switch slot="right" v-model="showMoneySwitch"></u-switch></u-form-item> -->
				<u-form-item label-width="160rpx" label="押金">
					<u-input v-model="form.money" placeholder="请输入押金" type="select" @click="showMoneySelect = true" />
					<u-picker mode="selector" range-key="name" :range="moneyList" v-model="showMoneySelect" @confirm="moneyConfirm"></u-picker>
				</u-form-item>
				<u-form-item label-width="160rpx" label="品牌">
					<u-input v-model="form.brant" placeholder="请输入品牌" type="select" @click="showBrandSelect = true" />
					<u-picker mode="selector" range-key="name" :range="brandList" v-model="showBrandSelect" @confirm="brandConfirm"></u-picker>
				</u-form-item>
				<u-form-item label-width="160rpx" label="机器码">
					<u-input v-model="form.machineCode" placeholder="请输入机器码" />
					<u-button plain size="mini" type="success" @click="openDeviceList()">选择机器</u-button>
				</u-form-item>
				<u-form-item label-width="160rpx" label="反馈" required>
					<u-input type="textarea" v-model="form.feedBack" placeholder="请输入初步预约时间以及和客户沟通情况" />
				</u-form-item>
				<u-form-item label-width="160rpx" label="上传图片" required v-if="form.state == 'order_status_out_success' || form.state == 'order_status_out_fail'">
					<u-upload :header="header" :form-data="imageFormData" :max-count="maxCount" :show-progress="false" :deletable="deletable" :action="action" :file-list="form.resourceList"></u-upload>
				</u-form-item>

				<u-collapse v-if="form.feedBackList && form.feedBackList.length > 0">
					<u-collapse-item title="反馈记录">
						<view v-for="(feedback, index) in form.feedBackList" :key="feedback.id">
							<u-card
								:title="feedback.user.nickname"
								:show-head="true"
								:border-radius="10"
								:padding="20"
								margin="1rpx"
								:sub-title="feedback.createAt"
								:body-style="cardBody"
							>
								<view slot="body">
									<u-row gutter="16" justify="center">
										<u-col span="12">
											<view class="u-body-item-title u-line-10">{{ feedback.content }}</view>
										</u-col>
									</u-row>
								</view>
							</u-card>
						</view> 
					</u-collapse-item>
				</u-collapse>

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
				money: 0,
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
				resourceList: []
			},
			imageFormData: {
				orderId: '',
			},
			header: '',
			cardBody: {},
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
				]
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
			bankList: [],
			brandList: [],
			moneyList: [],
			dictBankCode: '26612cfad91e4fffb855832432a7729b',
			dictBrandCode: 'dfddf0d428a44413a9b8130f5b7579f7',
			dictMoneyCode: 'e1da70506694400dbfe362dee5be2b63',
			showBankSelect: false,
			showBrandSelect: false,
			showMoneySelect: false,
			action: getApp().globalData.action
		};
	},

	watch: {
		stateIndex(value) {
			this.form.state = this.stateList[value].code;
			this.form.stateName = this.stateList[value].name;
		},
		showMoneySwitch(value) {
			if (value) {
				this.form.money = 299;
			} else {
				this.form.money = '';
			}
		},
		'form.id'(val){
			this.imageFormData.orderId = val;
		}
	},
	mounted() {
		//this.loading = true;
		let token = uni.getStorageSync("login-token");
		if(token){
			this.header = {
				'login-token': token
			}
		}
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
			this.getOrderDetail(form.id)
		}
		this.getDict(this.dictBrandCode);
		this.getDict(this.dictBankCode);
		this.getDict(this.dictMoneyCode);
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
			});
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
		bankConfirm(index) {
			this.form.back = this.bankList[index].name;
		},
		brandConfirm(index) {
			this.form.brand = this.brandList[index].name;
		},
		moneyConfirm(index) {
			this.form.money = this.moneyList[index].name;
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
					if (that.pageType == 'add') {
						that.createOrder();
					} else if (that.pageType == 'edit') {
						that.updateOrder();
					}
				} else {
					console.log('验证失败');
				}
			});
		},
		openDeviceList() {
			var that = this;
			uni.navigateTo({
				url: '../device/device?type=editOrder',
				events: {
					// 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
					getDeviceNo: function(data) {
						console.log('获取到deviceNo', data);
						that.form.machineCode = data.deviceNo;
					}
				}
			});
		},
		async getOrderDetail(id){
		      try {
		        this.$refs.loading.showLoading();
		        let resp = await this.$request.get(`/order?id=${id}`)
		        console.log("订单详情", resp.data)
		        let form = resp.data.data
		        form.feedBack = '';
		        this.form = form;
		        if(this.form.resourceList){
		        	this.form.resourceList.forEach(item => {
		        		item.url =
		        			item.path +
		        			'?imageMogr2/thumbnail/720x/interlace/1|watermark/2/text/6ZO25Lm-56eR5oqA/font/bXN5aGJkLnR0Zg/fontsize/14/fill/IzY2NjY2Ng/dissolve/80/gravity/southeast/dx/10/dy/10';
		        	});
		        }
		        if (form.money) {
		        	this.showMoneySwitch = true;
		        }
				let user = uni.getStorageSync('user_info');
				this.form.departId = user.departId;
		      } catch (e) {
		        console.log("获取订单详情失败",e)
				this.$refs.uToast.show({
					title: '获取订单详情失败,请稍后再试',
					icon: false,
					position: 'bottom',
					type: 'fail'
				});
		      } finally {
		        this.$refs.loading.hideLoading();
		      }
		},
		async createOrder() {
			try {
				uni.showLoading({
					title: '提交订单中...'
				});
				let resp = await this.$request.post('/order', {
					data: this.form
				});
				if (resp.data.code != 200) {
					uni.showToast({
						title: '提交订单失败: ' + resp.data.message,
						icon: 'none'
					});
					return;
				}
				uni.showToast({
					title: '提交订单成功'
				});
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.emit('refreshOrderList', { data: '刷新界面' });
				uni.navigateBack({});
			} catch (e) {
				uni.showToast({
					title: '提交订单失败, 请稍后再试',
					icon: 'none'
				});
			} finally {
				uni.hideLoading();
			}
		},
		async getDict(code) {
			try {
				let response = await this.$request.get(`/dictionary/list/${code}?pageNum=1&pageSize=100`);
				console.log('字典 : ', response.data);
				if (this.dictBankCode === code) {
					this.bankList = response.data.data.data;
					this.form.back = this.bankList[0].name;
				} else if (this.dictBrandCode === code) {
					this.brandList = response.data.data.data;
					this.form.brant = this.brandList[0].name;
				} else if (this.dictMoneyCode === code) {
					this.moneyList = response.data.data.data;
					this.form.money = this.moneyList[0].name;
				}
			} catch (e) {
				console.log('获取字典列表失败', e.response.data);
				this.$store.commit('showSnackbar', {
					color: 'error',
					text: e.response.data.message ? e.response.data.message : '获取字典列表失败'
				});
			} finally {
				this.loading = false;
			}
		},

		async updateOrder() {
			try {
				uni.showLoading({
					title: '提交订单中...'
				});
				let resp = await this.$request.put('/order', {
					data: this.form
				});
				if (resp.data.code != 200) {
					uni.showToast({
						title: '提交订单失败: ' + resp.data.message,
						icon: 'none'
					});
					return;
				}
				uni.showToast({
					title: '提交订单成功'
				});
				const eventChannel = this.getOpenerEventChannel();
				eventChannel.emit('refreshOrderList', { data: '刷新界面' });
				uni.navigateBack({});
			} catch (e) {
				uni.showToast({
					title: '提交订单失败, 请稍后再试',
					icon: 'none'
				});
			} finally {
				uni.hideLoading();
			}
		}
	}
};
</script>

<style>
.u-body-item-title {
	font-size: 20rpx;
	color: #333;
}
</style>
