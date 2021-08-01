<template>
	<view>
		<u-navbar back-text="返回" :title="title" :background="background" title-color="#fff" back-icon-color="#ffffff" :back-text-style="{ color: '#fff' }">
			
		</u-navbar>
		<u-top-tips ref="uTips"></u-top-tips>
		<wyb-loading ref="loading" :hide-delay="150" loading-type="scale-line" />
		<u-toast ref="uToast" />
		<view class="content u-margin-20">
			<u-form :model="form" ref="uForm">
				
				<u-form-item label-width="160rpx" label="员工姓名" required>
					<u-input v-model="form.nickname" placeholder="请输入员工姓名" @input="nicknameChange" />
				</u-form-item>
				<u-form-item label-width="160rpx" label="手机号" required>
					<u-input v-model="form.phoneNumber" type='number' placeholder="请输入手机号" maxlength="11"/>
				</u-form-item>
				<u-form-item label-width="160rpx" label="用户名" required>
					<u-input v-model="form.username" placeholder="请输入用户名 (用于登录)" /></u-form-item>
				<u-form-item v-show="pageType==='add'" label-width="160rpx" label="密码" required>
					<u-input v-model="form.password" maxlength="11"
					placeholder="请输入密码">
					</u-input>
					<u-button size="mini" slot="right" type="success" @click="getPassword">自动生成</u-button>
				</u-form-item>
				<u-form-item label-width="160rpx" label="部门" required>
					<u-input v-model="form.departName" type="select" @click="showDeptSelect = true" placeholder="请选择部门" />
					<u-picker mode="selector" :default-selector="[0]" range-key="name" :range="departmentList" v-model="showDeptSelect" @confirm="departPicker"></u-picker>
				</u-form-item>
				<u-form-item label-width="160rpx" label="类型" required>
					<u-input v-model="form.roleName" type="select" @click="showTypeSelect = true" placeholder="请选择用户类型" />
					<u-picker mode="selector" v-model="showTypeSelect" @confirm="userPicker" :range="userTypeList" range-key="roleName"></u-picker>
				</u-form-item>
				<u-form-item label-width="160rpx" label="库存">
					<u-input v-model="form.stock" placeholder="请输入库存" type='number' maxlength="4" />
				</u-form-item>
				<u-form-item label-width="160rpx" label="上传照片">
					<u-upload :max-count="maxCount" :show-progress="false" :deletable="deletable" 
					:action="action" :file-list="form.resourceList"></u-upload>
				</u-form-item>
				<u-button :custom-style="customStyle" type="primary" :ripple="true" @click="save()" 
				:loading="loading">提交</u-button>
			</u-form>
		</view>
		<u-modal show-cancel-button @confirm="addUser()" v-model="showAddSuccess" 
		@cancel="cancelAdd()"
		content="添加成功, 员工信息已经复制到剪贴板, 是否继续添加员工?">
			
		</u-modal>
	</view>
</template>

<script>
	//数组
	var seed = new Array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z',
	'a','b','c','d','e','f','g','h','i','j','k','m','n','p','Q','r','s','t','u','v','w','x','y','z',
	'2','3','4','5','6','7','8','9'
	);
	import { pinyin } from 'pinyin-pro';
	export default {
		data() {
			return {
				background: getApp().globalData.background,
				title: "添加人员",
				form: {
					userId: '',
					username: '',
					password: '',
					nickname: '',
					role: '',
					roleName: '',
					headPortrait: '',
					phoneNumber: '',
					stock: '',
					departId: '',
					departName: '',
					
				},
				showAddSuccess: false,
				showDeptSelect: false,
				showTypeSelect: false,
				departIndex: 0,
				departmentList: [
					{
						name: ''
					}
				],
				userTypeList: [],
				userTypeIndex: 0,
				loading: false,
				customStyle: {
					marginTop: '40rpx', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
					width: '600rpx',
					marginBottom: '20rpx'
				},
				action: getApp().globalData.action,
				maxCount: '1',
				deletable: true,
				pageType: 'add',
			}
		},
		mounted() {
			if (this.pageType == 'edit') {
				this.title = '编辑员工';
				let user = uni.getStorageSync('user');
				if(user){
					this.form = user;
					this.form.role = user.roles[0].roleTag
					this.form.roleName = user.roles[0].roleName
				}
			} else {
				this.title = '新增员工';
				uni.removeStorageSync('user');
			}
			this.getDepartList()
			this.getUserTypes()
		},
		onLoad(argument) {
			let type = argument.type;
			this.pageType = type;
		},
		methods: {
			nicknameChange(data){
				console.log("昵称改变",data)
				let username = pinyin(data, { toneType: 'none' });
				this.form.username = this.Trim(username,"g");
			},
			Trim(str,is_global){
				var result;
				result = str.replace(/(^\s+)|(\s+$)/g,"");
				if(is_global.toLowerCase()=="g")
					result = result.replace(/\s/g,"");
				return result;
			},
			getPassword(){
				let size = 8;
				//数组长度
				let seedlength = seed.length;
				let creatPassword=[];
				for (var i=0;i<size;i++) {
					let j = Math.floor(Math.random()*seedlength);
					creatPassword+= seed[j];
				}
				this.form.password = creatPassword;
			},
			departPicker(index) {
				this.departIndex = index;
				this.form.departName = this.departmentList[index].name;
				this.form.departId = this.departmentList[index].id;
			},
			userPicker(index) {
				this.userTypeIndex = index;
				this.form.role = this.userTypeList[index].roleTag;
				this.form.roleName = this.userTypeList[index].roleName;
			},
			addUser(){	
				this.showAddSuccess = false;
				this.$refs.uForm.resetFields();
			},
			cancelAdd(){
				this.showAddSuccess = false;
				const eventChannel = this.getOpenerEventChannel()
				eventChannel.emit('refreshOrderList', {data: '刷新界面'});
				uni.navigateBack({
					
				})
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
			},
			save(){
				if(!this.form.nickname){
					this.$refs.uToast.show({
						title: '请输入员工姓名',
						position: 'bottom',
						type: 'warning'
					});
					return;
				}
				if(!this.form.phoneNumber){
					this.$refs.uToast.show({
						title: '请输入手机号',
						position: 'bottom',
						type: 'warning'
					});
					return;
				}
				if(!this.form.username){
					this.$refs.uToast.show({
						title: '请输入用户名',
						position: 'bottom',
						type: 'warning'
					});
					return;
				}
				if(!this.form.password && this.pageType === 'add'){
					this.$refs.uToast.show({
						title: '请输入密码',
						position: 'bottom',
						type: 'warning'
					});
					return;
				}
				if(!this.form.departId){
					this.$refs.uToast.show({
						title: '请选择部门',
						position: 'bottom',
						type: 'warning'
					});
					return;
				}
				if(!this.form.role){
					this.$refs.uToast.show({
						title: '请选择用户类型',
						position: 'bottom',
						type: 'warning'
					});
					return;
				}
				
				if(this.pageType === 'add'){
					this.register()
				}else{
					this.updateUser()
				}
			},
			async register(){
				try {
					this.$refs.loading.showLoading();
					this.loading = true;
					let resp = await this.$request.post('/user/register',{
						data:this.form
					});
					if (resp.data.code != 200) {
						uni.showToast({
							title: '注册失败: ' + resp.data.message,
							icon: 'none'
						});
						return;
					} 
					let userInfo = `员工: ${this.form.nickname},  用户名: ${this.form.username}, 密码: ${this.form.password}, 部门: ${this.form.departName}, 类型: ${this.form.roleName}`;
					var that = this;
					uni.setClipboardData({
					    data: userInfo,
					    success: function () {
					        that.showAddSuccess = true;
					    }
					});
				} catch (e) {
					uni.showToast({
						title: '注册失败，请稍后再试',
						icon: 'none'
					});
					console.log('注册失败', e);
				} finally {
					this.$refs.loading.hideLoading();
					this.loading = false;
				}
			},
			async updateUser(){
				try {
					this.$refs.loading.showLoading();
					this.loading = true;
					let resp = await this.$request.post('/user/change',{
						data:this.form
					});
					if (resp.data.code != 200) {
						uni.showToast({
							title: '修改信息失败: ' + resp.data.message,
							icon: 'none'
						});
						return;
					} 
					let userInfo = `员工: ${this.form.nickname},  用户名: ${this.form.username}, 密码: ${this.form.password}, 部门: ${this.form.departName}, 类型: ${this.form.roleName}`;
					var that = this;
					uni.setClipboardData({
					    data: userInfo,
					    success: function () {
					        that.showAddSuccess = true;
					    }
					});
				} catch (e) {
					uni.showToast({
						title: '修改信息失败，请稍后再试',
						icon: 'none'
					});
					console.log('修改信息失败', e);
				} finally {
					this.$refs.loading.hideLoading();
					this.loading = false;
				}
			}
		}
	}
</script>

<style>

</style>
