<template>
	<view>
		<u-navbar back-text="返回" title="订单" :background="background"></u-navbar>
		<view class="content">
			<u-tabs :list="stateList" :is-scroll="true" :current="current" @change="change"></u-tabs>
			<u-empty text="订单为空" mode="list" v-if="orderList.length < 1"></u-empty>
			<view v-for="order in orderList" v-else>
				<u-card :show-head='false' :show-foot='false' :padding='20'>
					<view class="" slot="body" @click="showSheet=true">
						<view class="u-body-item-title u-line-2">
							用户姓名：{{order.username}}
						</view>
						<view class="u-body-item-title u-line-2">
							用户电话：{{order.phone}}
						</view>
						<view class="u-body-item-title u-line-2">
							营销时间：{{order.createAt}}
						</view>
						<view class="u-body-item-title u-line-2">
							预约时间：{{order.outboundAt}}
						</view>
						<view class="u-body-item-title u-line-2">
							外派：{{order.expatriatesUser.nickname}}
						</view>
						<view class="u-body-item-title u-line-2">
							地址：{{order.address}}
						</view>
						<u-action-sheet @click="clickSheet" :list="sheetList" v-model="showSheet">
							
						</u-action-sheet>
					</view>
				</u-card>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				stateList: [],
				orderList: [],
				showSheet: false,
				sheetList: [{
					text: '派单',
					color: 'blue'
				}, {
					text: '编辑'
				}, {
					text: '详情'
				}, {
					text: '删除'
				}],
				current: 0,
				background: {
					backgroundImage: 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
				},
				queryParams: {
					pageNum: 1,
					pageSize: 20,
					state: '',
				}
			}
		},
		onLoad() {
			this.getOrderList()
		},
		methods: {
			clickSheet(index){
				switch(index){
					case 1:
					uni.navigateTo({
						url:'editOrder'
					})
					break;
				}
			},
			change(index) {
				this.current = index;
				this.queryParams.state = this.stateList[index].code;
				this.getOrderList()
			},
			async getOrderList() {
				try {
					let resp = await this.$request.post("/order/list", {
						data: this.queryParams
					});
					if (resp.data.code != 200) {
						return;
					}
					this.stateList = resp.data.data.stateList
					uni.setStorageSync("stateList",this.stateList)
					this.orderList = resp.data.data.data
				} catch (e) {
					console.log("订单状态失败", e)
				} finally {
					uni.stopPullDownRefresh()
				}
			}
		},
		onPullDownRefresh() {
			this.getOrderList()
		}
	}
</script>

<style>

</style>
