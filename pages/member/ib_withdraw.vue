<template>
	<view>
		<view class="box">
			<view class="invite-balance-box">
				<view class="balance-value">
					<text>￥{{user.invite_balance}}</text>
				</view>
				<view class="buttons">
					<view class="showWithdraw" @click="showWithdraw">提现</view>
					<view class="showRecords" @click="showWithdrawRecords">提现记录</view>
				</view>
			</view>
		</view>

		<view class="records-box">
			<block v-if="records.length > 0">
				<view class="item" v-for="(record,index) in records" :key="record.id">
					<view class="content">
						<view class="remark">{{record.desc}}</view>
						<view class="date">{{record.created_at}}</view>
					</view>
					<view :class="['sum',record.total > 0 ? 'income' : '']">
						{{record.total > 0 ? '+' + record.total : record.total}}
					</view>
				</view>
			</block>
			<meedu-none v-else></meedu-none>
		</view>

		<view class="withdraw-box-shadow" v-if="showBox">
			<view class="withdraw-box">

				<view class="input">
					<view class="name">支付宝账号</view>
					<view class="value">
						<input type="text" @input="inputChange($event)" data-key="account" />
					</view>
				</view>
				<view class="input">
					<view class="name">姓名</view>
					<view class="value">
						<input type="text" @input="inputChange($event)" data-key="name" />
					</view>
				</view>
				<view class="input">
					<view class="name">提现金额</view>
					<view class="value">
						<input type="number" @input="inputChange($event)" data-key="total" />
					</view>
				</view>

				<view class="input">
					<text class="confirm-button" @click="confirmWithdraw">确认提现</text>
				</view>
				<view class="input">
					<text class="cancel-button" @click="cancelWithdraw">取消提现</text>
				</view>
			</view>
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
				user: {
					invite_balance: 0
				},
				records: [],
				pagination: {
					page: 1,
					page_size: 12,
					is_over: false
				},
				showBox: false,
				form: {
					account: '',
					name: '',
					total: 0
				}
			}
		},
		onShow: function() {
			this.getUser();
			this.getData(true);
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.loadMore();
		},

		methods: {
			getUser() {
				user.info().then(res => {
					this.user.invite_balance = res.invite_balance;
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
				user.inviteBalanceRecords(this.pagination).then(res => {
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
				this.pagination.page =  this.pagination.page + 1;
				this.getData();
			},

			showWithdraw() {
				this.showBox = true;
			},
			cancelWithdraw() {
				this.showBox = false;
			},

			confirmWithdraw() {
				if (this.form.account.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入支付宝账号',
					})
					return
				}
				if (this.form.name.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入姓名',
					})
					return
				}
				if (this.form.total <= 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入提现金额',
					})
					return
				}
				if (this.form.total > this.user.invite_balance) {
					uni.showToast({
						icon: 'none',
						title: '请输入合理的提现金额',
					})
					return
				}

				user.createWithdraw({
					channel: '支付宝',
					channel_account: this.form.account,
					channel_name: this.form.name,
					total: this.form.total,
				}).then(() => {
					uni.showToast({
						icon: 'none',
						title: '提交成功',
					})
					this.getUser();
					this.getData(true);
					this.cancelWithdraw();
				})
			},

			showWithdrawRecords() {
				uni.navigateTo({
					url: '/pages/member/withdraw_records',
				})
			},

			inputChange(e) {
				let key = e.currentTarget.dataset.key;
				let val = e.detail.value;
				// let obj = {};
				// obj[`form.${key}`] = val;
				this[`form.${key}`]  = val;
				// this.setData(obj);
			}
		}
	}
</script>

<style>
	page {
		background-color: #f2f2f2;
	}

	.box {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding-left: 15px;
		padding-right: 15px;
	}

	.invite-balance-box {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px;
		margin-top: 15px;
		background-color: white;
	}

	.invite-balance-box>.balance-value {
		width: 100%;
		height: auto;
		float: left;
		margin-bottom: 30px;
		text-align: center;
	}

	.invite-balance-box>.balance-value>text {
		color: #333;
		font-size: 20px;
		font-weight: 700;
	}

	.invite-balance-box>.buttons {
		width: 100%;
		height: auto;
		float: left;
	}

	.invite-balance-box>.buttons>.showWithdraw {
		display: block;
		width: 100%;
		height: 36px;
		background-color: #1784ED;
		line-height: 36px;
		color: white;
		text-align: center;
		border-radius: 18px;
	}

	.invite-balance-box>.buttons>.showRecords {
		width: 100%;
		height: auto;
		float: left;
		line-height: 36px;
		font-size: 12px;
		color: rgba(0, 0, 0, .6);
		text-align: center;
	}

	.records-box {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 15px;
		box-sizing: border-box;
		padding-left: 15px;
		padding-right: 15px;
	}

	.records-box>.item {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 15px;
		background-color: white;
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

	.withdraw-box-shadow {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, .4);
	}

	.withdraw-box-shadow>.withdraw-box {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;
		background-color: white;
	}

	.withdraw-box-shadow>.withdraw-box>.input {
		width: 100%;
		height: auto;
		float: left;
		margin-bottom: 15px;
	}

	.withdraw-box-shadow>.withdraw-box>.input>.name {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		color: #aaa;
		margin-bottom: 5px;
	}

	.withdraw-box-shadow>.withdraw-box>.input>.value {
		width: 100%;
		height: auto;
		float: left;
	}

	.withdraw-box-shadow>.withdraw-box>.input>.value>input {
		width: 100%;
		height: 40px;
		float: left;
		border: 0;
		border-bottom: 1px solid #f2f2f2;
		box-sizing: border-box;
		padding: 5px 10px;
	}

	.withdraw-box-shadow>.withdraw-box>.input>.confirm-button {
		width: 100%;
		height: 42px;
		line-height: 42px;
		float: left;
		text-align: center;
		background-color: #1784ED;
		color: white;
		border-radius: 21px;
		font-size: 14px;
	}

	.withdraw-box-shadow>.withdraw-box>.input>.cancel-button {
		width: 100%;
		height: 30px;
		line-height: 30px;
		float: left;
		text-align: center;
		color: #aaa;
		font-size: 14px;
	}
</style>
