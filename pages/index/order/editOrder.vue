<template>
	<view>
		<u-navbar back-text="返回" title="编辑订单" :background="background"></u-navbar>
		<view class="content u-margin-20">
			<u-form :model="form" ref="uForm">
				<u-form-item label-width="160rpx" label="客户姓名">
					<u-input v-model="form.username" placeholder="请输入客户姓名" />
				</u-form-item>
				<u-form-item label-width="160rpx" label="客户电话">
					<u-input v-model="form.phone" placeholder="请输入客户电话" />
				</u-form-item>
				<u-form-item label-width="160rpx" label="银行">
					<u-input v-model="form.back" placeholder="请输入银行" />
				</u-form-item>
				<u-form-item label-width="160rpx" label="外访地址">
					<u-input right-icon="map" v-model="form.address" placeholder="请输入外访地址">
					</u-input>
					<u-button size="mini" type="primary" @click="openMap">
						地图选址
					</u-button>
				</u-form-item>
				<u-form-item label-width="160rpx" label="订单状态">
					<u-input v-model="form.state" type="select" @click="showStatusList = true" placeholder="请选择订单状态" />
					<u-picker mode="selector" :default-selector="[0]" range-key="name" :range="stateList"
						v-model="showStatusList">

					</u-picker>
				</u-form-item>
				<u-form-item label-width="160rpx" label="预约时间">
					<u-input v-model="form.outboundAt" type="select" @click="showTimeSelect = true"
						placeholder="请选择订单状态" />
					<u-picker mode="time" v-model="showTimeSelect" :params="timeParams"></u-picker>
				</u-form-item>
				<u-form-item label-width="160rpx" label="收取押金">
					<u-switch slot="right" v-model="showMoneySwitch"></u-switch>
				</u-form-item>
				<u-form-item label-width="160rpx" label="押金" v-if="showMoneySwitch">
					<u-input v-model="form.money" placeholder="请输入押金" />
				</u-form-item>
				<u-form-item label-width="160rpx" label="品牌">
					<u-input v-model="form.brant" placeholder="请输入品牌" />
				</u-form-item>
				<u-form-item label-width="160rpx" label="机器码">
					<u-input v-model="form.machineCode" placeholder="请输入机器码" />
				</u-form-item>
				<u-form-item label-width="160rpx" label="反馈">
					<u-input type='textarea' v-model="form.feedBack" placeholder="请输入反馈" />
				</u-form-item>
				<u-button :custom-style="customStyle" type="primary"  :ripple="true" @click=""
					:loading="loading">提交</u-button>

			</u-form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundImage: 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
				},
				form: {
					username: '',
					phone: '',
					back: '',
					money: '',
					state: '',
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
					brant: ''
				},
				showStatusList: false,
				showTimeSelect: false,
				loading: false,
				timeParams: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				showMoneySwitch: false,
				stateList: [],
				customStyle: {
					marginTop: '40rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
					width: '600rpx',
					marginBottom: '20rpx'
				}
			}
		},
		mounted() {

			let list = uni.getStorageSync("stateList")
			if (list) {
				this.stateList = list
			}
		},
		onLoad() {

		},
		methods: {
			openMap() {

			}
		}
	}
</script>

<style>

</style>
