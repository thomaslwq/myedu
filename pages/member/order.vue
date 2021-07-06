<template>
	<view>
		<view class="orders-list-box">
			<block v-if="orders.length > 0">
				<view class="item" v-for="(order,index) in orders" :key="order.id">
					<view class="info">
						<view class="date">{{order.created_at}}</view>
						<view :class="['status', order.status_text !== '已支付' ? 'red' : '']">
							{{order.status_text}}
						</view>
					</view>
					<view class="goods">
						<view class="name">
							<view class="text">{{order.goods[0].goods_text}}</view>
							<view class="payment">{{order.payment_text}}</view>
						</view>
						<view class="charge">
							<text class="value">￥{{order.charge}}</text>
						</view>
					</view>
				</view>
			</block>
			<meedu-none v-else></meedu-none>
		</view>
	</view>
</template>
<script>
	import EduNone from "@/components/edu-none.vue"
	import {
		user
	} from '@/api/index'

	export default {
		components: {
			"meedu-none": EduNone
		},
		data() {
			return {
				pagination: {
					page: 1,
					page_size: 8,
					is_over: false
				},
				orders: []
			};
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getData(true);
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.getData(true);
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.loadMore();
		},
		methods: {
			getData(reset = false) {
				if (reset) {
					this.pagination.page = 1;
					this.pagination.is_over = false;
					this.orders = []
				}
				if (this.pagination.is_over) {
					return;
				}
				user.orders(this.pagination).then(res => {
					let data = res.data;
					if (data.length === 0) {
						
						this.pagination.is_over =  true;
						
					} else {
						let list = this.orders;
						list.push(...data);
						this.orders =  list;
					}
					if (reset) {
						uni.stopPullDownRefresh();
					}
				})
			},

			loadMore() {
				if (this.pagination.is_over) {
					return;
				}
				this.pagination.page =  this.pagination.page + 1;
				this.getData();
			}
		}
	}
</script>

<style lang="scss">
	.orders-list-box {
		width: 100%;
		height: auto;
		float: left;
		background-color: white;
	}

	.orders-list-box>.item {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 15px;
		border-bottom: 1px solid #f2f2f2;
	}

	.orders-list-box>.item>.info {
		width: 100%;
		height: auto;
		float: left;
		display: flex;
		margin-bottom: 20px;
	}

	.orders-list-box>.item>.info>.date {
		flex: 1;
		text-align: left;
		font-size: 13px;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 1;
	}

	.orders-list-box>.item>.info>.status {
		flex: 1;
		text-align: right;
		font-size: 13px;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 1;
	}

	.orders-list-box>.item>.info>.status.red {
		color: rgba(255, 77, 79, 1);
	}

	.orders-list-box>.item>.goods {
		width: 100%;
		height: auto;
		float: left;
		display: flex;
	}

	.orders-list-box>.item>.goods>.name {
		flex: 1;
	}

	.orders-list-box>.item>.goods>.name>.text {
		width: 100%;
		height: auto;
		float: left;
		font-size: 15px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 1;
		margin-bottom: 10px;
	}

	.orders-list-box>.item>.goods>.name>.payment {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 1;
	}

	.orders-list-box>.item>.goods>.charge {
		padding-left: 15px;
		font-size: 20px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 1;
	}
</style>
