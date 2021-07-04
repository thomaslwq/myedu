<template>
	<view>
		<view class="credit1-box">
			<view class="credit1-text">
				我的积分：<text class="value">{{credit1}}</text>
			</view>
		</view>

		<view class="credit1-records-box">
			<block v-if="records.length > 0">
				<view class="item" v-for="(record,index) in records" :key="record.id">
					<view class="content">
						<view class="remark">
							{{record.remark}}
						</view>
						<view class="date">
							{{record.created_at}}
						</view>
					</view>
					<view :class="['value', record.sum>0?'income': '']">
						{{record.sum>0?'+'+record.sum:record.sum}}
					</view>
				</view>
			</block>
			<meedu-none v-else></meedu-none>
		</view>
	</view>
</template>

<script>
	import {
		user
	} from '@/api/index'
	import EduNone from "@/components/edu-none.vue"
	export default {
		components: {
			"meedu-none": EduNone
		},
		data() {
			return {
				credit1: 0,
				records: [],
				pagination: {
					page: 1,
					page_size: 12,
					is_over: false
				}
			};
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getData(true);
			this.getUser();
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
		getUser() {
			user.info().then(res => {

				this.credit1 = res.credit1

			})
		},

		getData(reset = false) {
			if (reset) {
				this.pagination.page = 1;
				this.pagination.is_over = false;
				this.records = [];
			}
			if (this.pagination.is_over) {
				return;
			}
			user.credit1Records(this.pagination).then(res => {
				let data = res.data;
				if (data.length === 0) {
					this.pagination.is_over =  true;
				} else {
					let list = this.data.records;
					list.push(...data);
					this.records =  list;
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
</script>

<style lang="scss">
	.credit1-box {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px;
		background-color: #1784ED;
	}

	.credit1-box>.credit1-text {
		width: 100%;
		height: auto;
		float: left;
		font-size: 16px;
		font-weight: 600;
		color: white;
		line-height: 1;
	}

	.credit1-records-box {
		width: 100%;
		height: auto;
		float: left;
		background-color: white;
	}

	.credit1-records-box>.item {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 15px;
		border-bottom: 1px solid #f2f2f2;
		display: flex;
	}

	.credit1-records-box>.item>.content {
		flex: 1;
	}

	.credit1-records-box>.item>.content>.remark {
		width: 100%;
		height: auto;
		float: left;
		font-size: 15px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 1;
		margin-bottom: 10px;
	}

	.credit1-records-box>.item>.content>.date {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		font-weight: 400;
		color: rgba(163, 163, 163, 1);
		line-height: 12px;
	}

	.credit1-records-box>.item>.value {
		margin-left: 15px;
		font-size: 15px;
		font-weight: 500;
		color: rgba(255, 77, 79, 1);
		line-height: 1;
	}

	.credit1-records-box>.item>.value.income {
		color: green;
	}
</style>
