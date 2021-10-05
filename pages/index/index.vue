<template>
	<view>
		<u-navbar :is-back="false" title="订单系统" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }"></u-navbar>
		<view class="content">
			<view v-if="isExpatriates">
				<v-cell-group>
					<u-cell-item icon="bell" title="当前是否接单" :arrow="false">
						<u-switch slot="right-icon" v-model="isEnabled" @change="updateUserState()"></u-switch>
					</u-cell-item>
				</v-cell-group>
			</view>
			<u-swiper :list="list" effect3d></u-swiper>
			<u-grid :col="3">
				<u-grid-item @click="onGridClick(item.url)" class="ripple" v-for="(item, index) in homeList" :key="index">
					<uni-transition ref="ani" :mode-class="['fade', 'zoom-in']" :duration="100" :show="showAnimation" timingFunction="ease-in-out" :delay="(index + 1) * 100">
						<view class="u-flex u-col-center u-row-center" style="flex-direction: column;">
							<image class="image" :src="item.icon"></image>
							<view class="grid-text">{{ item.title }}</view>
						</view>
					</uni-transition>
				</u-grid-item>
			</u-grid>
			<u-cell-group><u-cell-item icon="volume-up" title="消息通知" :arrow="false">
			</u-cell-item></u-cell-group>
			<view v-for="(message,index) in messageList" :key='index'>
				<u-alert-tips type="warning" :close-able="true"  @close="colseMessage(message)"
				:title="message.type" :description="message.desc" >
				</u-alert-tips>
			</view>
		</view>
	</view>
</template>

<script>
//心跳检测
var heartCheck = {
	timeout: 30000, //1分钟发一次心跳
	timeoutObj: null,
	serverTimeoutObj: null,
	reset: function() {
		clearTimeout(this.timeoutObj);
		clearTimeout(this.serverTimeoutObj);
		return this;
	},
	start: function(userId) {
		var self = this;
		this.timeoutObj = setTimeout(function() {
			//这里发送一个心跳，后端收到后，返回一个心跳消息，
			//onmessage拿到返回的心跳就说明连接正常
			let message = {
				userId: userId,
				message: 'ping'
			};
			uni.sendSocketMessage({
				data: JSON.stringify(message)
			});
			console.log('发送心跳包:', message);
			self.serverTimeoutObj = setTimeout(function() {
				//如果超过一定时间还没重置，说明后端主动断开了
				if(this.timeoutObj && this.serverTimeoutObj){
					console.log('客户端主动关闭',this.timeoutObj,this.serverTimeoutObj);
					uni.closeSocket(); //如果onclose会执行reconnect，我们执行socket.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
				}
				
			}, self.timeout);
		}, this.timeout);
	}
};
export default {
	data() {
		return {
			messageList : [
				
			],
			homeList: [
				{
					icon: '../../static/img_framily.png',
					title: '人员管理',
					url: 'user/user'
				},
				{
					icon: '../../static/ic_img_3.png',
					title: '订单中心',
					url: 'order/order'
				},
				{
					icon: '../../static/ic_img_4.png',
					title: '日报管理',
					url: 'dailyPaper/dailyPaper'
				},
				/* {
					icon: "../../static/ic_img_6.png",
					title: "数据汇总",
					url: "order/order"
				}, */
				{
					icon: "../../static/ic_img_6.png",
					title: "设备管理",
					url: "device/device"
				},
				{
					icon: '../../static/ic_img_1.png',
					title: '个人中心',
					url: 'personal/personal'
				}
			],
			background: getApp().globalData.background,
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
			],
			isEnabled: false,
			user: '',
			isExpatriates: false,
			showAnimation: true
		};
	},
	onLoad() {},
	onShow() {
		//this.showAnimation = true;
	},
	onHide() {
		//this.showAnimation = false;
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
				this.user = resp.data.data;
				this.isEnabled = this.user.status === 0 ? true : false;
				console.log('已经登录了', resp.data);
				if (this.user.roles[0].roleTag === 'expatriates') {
					this.isExpatriates = true;
					this.homeList.shift();
				} else if (this.user.roles[0].roleTag === 'teleMarketing') {
					this.homeList.shift();
				} else {
				}
				this.openSocket();
			} catch (e) {
				console.log('用户未登录');
			}
		},
		onGridClick(url) {
			uni.navigateTo({
				url: url
			});
		},
		async updateUserState() {
			try {
				uni.showLoading({
					title: '更新状态中...'
				});
				let resp = await this.$request.post('/user/change', {
					data: {
						userId: this.user.userId,
						status: this.isEnabled ? 0 : 1
					}
				});
				if (resp.data.code != 200) {
					return;
				}
				resp = await this.$request.get('/user/verify');
				if (resp.data.code != 200) {
					uni.redirectTo({
						url: '../user/login'
					});
					return;
				}
				this.user = resp.data.data;
				console.log('修改成功', resp.data);
			} catch (e) {
				console.log('修改失败');
			} finally {
				uni.hideLoading();
			}
		},
		openSocket() {
			var that = this;
			var socketTask = uni.connectSocket({
				url: getApp().globalData.socket + '/' + that.user.userId, //仅为示例，并非真实接口地址。
				complete: () => {}
			});
			uni.onSocketOpen(function(res) {
				console.log('WebSocket连接已打开！');
				heartCheck.reset().start(that.user.userId); //心跳检测重置
			});
			uni.onSocketError(function(res) {
				console.log('WebSocket连接打开失败，请检查！',res);
			});
			uni.onSocketMessage(function(res) {
				if (res.data == 'ping') {
					heartCheck.reset().start(that.user.userId); //拿到任何消息都说明当前连接是正常的
					console.log('收到心跳包，重置');
					return;
				}
				var serverMsg = JSON.parse(res.data);
				console.log('收到服务器内容：', serverMsg);
				
				if(serverMsg.type == 'create_order'){
					let message = {
						id: '',
						type: '新订单通知',
						desc: ''
					}
					message.id = serverMsg.data.id;
					message.type = '新订单通知';
					message.desc = `客户姓名: ${serverMsg.data.username}, 客户电话: ${serverMsg.data.phone}, 预约时间: ${serverMsg.data.outboundAt}, 预约地址: ${serverMsg.data.address}
					`;
					that.messageList.push(message); 
				}else{
					if(serverMsg.data){
						serverMsg.data.forEach(item =>{
							let message = {
								id: '',
								type: '新订单通知',
								desc: ''
							}
							message.id = item.id;
							message.type = '新订单通知';
							message.desc = `客户姓名: ${item.username}, 客户电话: ${item.phone}, 预约时间: ${item.outboundAt}, 预约地址: ${item.address}
							`;
							message.type = "派单通知";
							that.messageList.push(message); 
						})
						
					}
				}
				
			});
			uni.onSocketClose(function(res) {
				console.log('WebSocket 已关闭！');
			});
		},
		colseMessage(message){
			console.log("message",message.id, this.messageList)
			this.messageList = this.messageList.filter(item=>
				item.id != message.id
			)
			console.log("message",this.messageList)
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
.image {
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
	background-image: radial-gradient(circle, rgba(0, 0, 0, 0.5) 10%, transparent 10.01%);
	background-repeat: no-repeat;
	background-position: 50%;
	transform: scale(10, 10);
	opacity: 0;
	transition: transform 0.3s, opacity 0.5s;
}

.ripple:active:after {
	transform: scale(0, 0);
	opacity: 0.3;
	transition: 0s;
}
</style>
