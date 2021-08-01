<template>
	<view>
		
		<!-- <u-navbar :is-back="false" title="　" :border-bottom="false">
			<view class="u-flex u-row-right" style="width: 100%;">
				<view class="camera u-flex u-row-center">
					<u-icon name="camera-fill" color="#000000" size="48"></u-icon>
				</view>
			</view>
		</u-navbar> -->
		<u-toast ref="uToast" />
		<u-navbar back-text="返回" title="个人中心" :background="background" title-color="#fff" 
			back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }">
		</u-navbar>
		
		
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-20">
			<view class="u-m-r-10 u-m-t-20">
				<u-avatar :src="wechatUserInfo?wechatUserInfo.avatarUrl:pic" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{user.nickname}}</view>
				<view class="u-font-14 u-tips-color">账号: {{user.username}}</view>
			</view>
			<!-- <view class="u-m-l-10 u-p-10">
				<u-icon name="scan" color="#969799" size="28"></u-icon>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view> -->
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="pushpin" title="部门" :arrow="false" :value="user.departName"></u-cell-item>
				<u-cell-item icon="phone" title="电话" :arrow="false" :value="user.phoneNumber"></u-cell-item>
				<u-cell-item icon="bag" title="库存" :arrow="false" :value="user.stock"></u-cell-item>
				<u-cell-item icon="tags" title="角色" :arrow="false" :value="user.roles[0].roleName"></u-cell-item>
				<u-cell-item icon="map" title="地址" :arrow="false" :label="user.address"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20"> 
			<u-cell-group>
				<u-cell-item icon="warning" title="绑定微信" @click="bindWeChat()" :value="wechatUserInfo?('当前绑定: '+ wechatUserInfo.nickName):''"></u-cell-item>
				<u-cell-item icon="chat" title="微信消息订阅" :arrow="false" @click="openMessageSend()">
					<u-switch slot="right-icon" v-model="mainSwitch"></u-switch>
				</u-cell-item>
				<u-cell-item icon="lock" title="重置密码" @click="resetPassword()"></u-cell-item>
				<u-cell-item icon="warning" title="退出登录" @click="logout()"></u-cell-item>
			</u-cell-group>
		</view>
		
		<u-modal show-cancel-button @confirm="getWechatProfile()" v-model="showGetUserProfile" content="是否同意获取微信个人信息"></u-modal>
		
		<u-modal show-cancel-button @confirm="confirmLogout()" v-model="showLogout" :content="content"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pic:'/static/ic_launcher.png',
				show:true,
				background: getApp().globalData.background,
				user:{
					userId: "",
					nickname: "",
					username: "",
					departName: "",
					address: "",
					phoneNumber: "",
					headPortrait: "",
					stock: "",
					roles: [
						{
							roleName: "",
							roleTag: "",
						}
					],
					
				},
				userLoginInfo:{
					sessionKey: '',
					signature: '',
					rawData: '',
					encryptedData: '',
					iv: '',
					userId: ''
				},
				showLogout: false,
				content: "是否退出登录",
				mainSwitch: false,
				showGetUserProfile: false,
				wechatUserInfo: '',
			}
		},
		onPullDownRefresh() {
			this.isLogin()
		},
		mounted() {
			uni.startPullDownRefresh({
				
			})
			var that = this;
			//#ifdef MP-WEIXIN
			wx.getSetting({
				withSubscriptions:true,
				success(res) {
					console.log("消息订阅状态",res.subscriptionsSetting.mainSwitch)
					that.mainSwitch = res.subscriptionsSetting.mainSwitch;
				}
			})
			//#endif
		},
		methods: {
			async isLogin() {
				//判断缓存中是否登录过，直接登录
				try{
					let resp = await this.$request.get("/user/verify");
					if (resp.data.code != 200) {
						return;
					}
					console.log("已经登录了",resp.data.data)
					this.user = resp.data.data;
					uni.setStorageSync("user_info",this.user)
					if(this.user.wechatUserInfo){
						this.wechatUserInfo = JSON.parse(this.user.wechatUserInfo)
					}
				}catch(e){
					console.log("用户未登录")
				}finally{
					uni.stopPullDownRefresh()
				}
			},
			resetPassword(){
				uni.navigateTo({
					url:'../../user/forget'
				})
			},
			logout(){
				this.showLogout = true;
			},
			confirmLogout(){
				uni.removeStorageSync("user_info")
				uni.removeStorageSync("login-token")
				uni.redirectTo({
					url:'../../splash/splash'
				})
			},
			bindWeChat(){
				if(this.wechatUserInfo){
					this.$refs.uToast.show({
						title: '当前已经绑定账号了，无须重复绑定',
						icon: false,
						position: 'bottom',
						type: 'success'
					})
					return;
				}
				var that = this;
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
				    console.log("结果",loginRes);
					that.loginFromServer(loginRes.code);
				  }
				});
			},
			async loginFromServer(code){
				var that = this;
				try{
					uni.showLoading({
						
					})
					let resp = await this.$request.get("/wx/user/" + getApp().globalData.appid + "/login?code="+code+"&userId="+this.user.userId);
					if (resp.data.code != 200) {
						return;
					}
					console.log("微信登录成功",resp.data.data)
					this.$refs.uToast.show({
						title: '微信登录成功',
						icon: false,
						position: 'bottom',
						type: 'success'
					})
					this.user = resp.data.data;
					uni.setStorageSync("user_info",this.user)
					this.showGetUserProfile = true;
				}catch(e){
					console.log("微信登录失败")
				}finally{
					uni.hideLoading()
				}
			},
			getWechatProfile(){
				var that = this;
				uni.getUserProfile({
					desc: "获取你的昵称、头像、地区及性别",
					success(infoRes) {
						console.log('用户信息为：' + infoRes.userInfo.avatarUrl);
						that.userLoginInfo.signature = infoRes.signature;
						that.userLoginInfo.rawData = infoRes.rawData;
						that.userLoginInfo.encryptedData = infoRes.encryptedData;
						that.userLoginInfo.iv = infoRes.iv;
						that.getWeChatUserInfo();
					},
					fail(e) {
						console.log("获取用户信息失败",e)
						that.$refs.uToast.show({
							title: '获取用户信息失败',
							icon: false,
							position: 'bottom',
							type: 'fail'
						})
					}
				})
			},
			async getWeChatUserInfo(){
				try{
					uni.showLoading({
						
					})
					this.userLoginInfo.userId = this.user.userId;
					this.userLoginInfo.sessionKey = this.user.sessionKey;
					let resp = await this.$request.post("/wx/user/" + getApp().globalData.appid + "/info", {
						 data:this.userLoginInfo
					 });
					if (resp.data.code != 200) {
						return;
					}
					console.log("获取信息成功",resp.data.data)
					this.wechatUserInfo = resp.data.data
					//this.pic = resp.data.data.avatarUrl
					this.$refs.uToast.show({
						title: '获取信息成功',
						icon: false,
						position: 'bottom',
						type: 'success'
					})
				}catch(e){
					console.log("获取信息失败",e)
					that.$refs.uToast.show({
						title: '获取信息失败',
						icon: false,
						position: 'bottom',
						type: 'fail'
					})
				}finally{
					uni.hideLoading()
				}
			},
			openMessageSend(){
				//开启微信消息订阅
				//#ifdef MP-WEIXIN
				wx.requestSubscribeMessage({
				  tmplIds: ['cUWOPsqgvgEH7g-FM9IDOMdW8sqcFKTOCW_OGKX0kLM'],
				  success (res) {
					  console.log("消息订阅",res)
				  },
				  fail(e){
					  console.log("消息订阅失败",e)
				  }
				})
				//#endif
			}
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}
</style>
