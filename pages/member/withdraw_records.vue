<template>
	<view>
		<view class="records-box">
			<block v-if="records.length > 0">
				<view class="item" v-for="(record,index) in records" :key="record.id">
					<view class="content">
						<view class="remark">{{record.status_text}}</view>
						<view class="date">{{record.created_at}}</view>
					</view>
					<view class="sum">
						￥{{record.total}}
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
				records: []
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
					this.records = []
				}
				if (this.pagination.is_over) {
					return;
				}
				user.withdrawRecords(this.pagination).then(res => {
					let data = res.data;
					if (data.length === 0) {
						this.pagination.is_over = true;
					} else {
						let list = this.records;
						list.push(...data);
						this.records = list;
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
				this.pagination.page = this.data.pagination.page + 1;
				this.getData();
			}
		}
	}
</script>

<style lang="scss">
	.records-box {
		width: 100%;
		height: auto;
		float: left;
		background-color: white;
	}

	.records-box>.item {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 15px;
		border-bottom: 1px solid #f2f2f2;
		display: flex;
	}

	.records-box>.item>.content {
		flex: 1;
	}

	.records-box>.item>.content>.remark {
		width: 100%;
		height: auto;
		float: left;
		font-size: 15px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 1;
		margin-bottom: 15px;
	}

	.records-box>.item>.content>.date {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		font-weight: 400;
		color: rgba(163, 163, 163, 1);
		line-height: 1;
	}

	.records-box>.item>.sum {
		margin-left: 10px;
		font-size: 15px;
		font-weight: 500;
		color: #FF4D4F;
		line-height: 1;
	}

	.records-box>.item>.sum.income {
		color: green;
	}
</style>
