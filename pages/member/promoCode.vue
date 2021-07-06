<template>
	<view>
		<view class="user-info">
			<view class="info">
				<view class="avatar">
					<image :src="user.avatar" />
				</view>
				<view class="nickname">
					{{user.nick_name}}
				</view>
			</view>

			<view class="data">
				<view class="people-count">
					<view class="value">{{invite_user_count}}</view>
					<view class="name">邀请人数</view>
				</view>
				<view class="balance-sum">
					<view class="value">{{user.invite_balance}}</view>
					<view class="name">邀请余额(元)</view>
				</view>
				<view class="buttons">
					<text class="withdraw" @click="goWithdraw">去提现</text>
				</view>
			</view>

		</view>

		<view class="promo_code-box" v-if="promo_code.length > 0">
			<view class="promo_code">
				<view class="content">
					<text class="value">{{promo_code}}</text>
				</view>
				<view class="buttons">
					<text class="copy" @click="copy">复制</text>
				</view>

				<view class="desc">
					<view>
						1.使用该优惠码的用户将获得{{ invited_user_reward }}元抵扣。
					</view>
					<view>
						2.当用户使用您的优惠码支付并完成订单的时候，您也将获得{{ invite_user_reward }}元奖励。
					</view>
					<view>
						3.使用您的优惠码完成支付的用户将会自动成为您的下级，TA的每一笔已支付订单您都将享有{{ per_order_draw * 100 }}%的抽成。
					</view>
				</view>
			</view>
		</view>

		<view class="promo_code-box" v-else>
			<view class="promo_code">
				<view class="content">
					<text class="create-promo_code" @click="createPromoCode">创建邀请码</text>
				</view>
			</view>
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
				user: {
					avatar: '',
					nick_name: '',
					invite_balance: 0
				},
				promo_code: '',
				invited_user_reward: 0,
				invite_user_reward: 0,
				per_order_draw: 0,
				invite_user_count: 0
			};
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getUser();
			this.getInviteUsers();
			this.getPromoCode();
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
			getUser() {
				user.info().then(res => {
					this.user.avatar = res.avatar;
					this.user.nick_name = res.nick_name;
					this.user.invite_balance = res.invite_balance;
				})
			},

			getInviteUsers() {
				user.inviteUsers().then(res => {
					this.invite_user_count = res.total;
				})
			},

			getPromoCode() {
				user.promoCode().then(res => {
					if (res.code) {
						this.promo_code = res.code;
						this.invite_user_reward = res.invite_user_reward;
						this.invited_user_reward = res.invited_user_reward;
						this.per_order_draw = res.per_order_draw
					}
				})
			},

			createPromoCode() {
				user.createPromoCode().then(res => {
					this.getPromoCode();
				}).catch(e => {
					unishowToast({
						icon: 'none',
						title: e,
					})
				})
			},

			copy() {
				if (this.promo_code.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请创建邀请码',
					})
					return
				}
				uni.setClipboardData({
					data: this.promo_code,
					success: () => {
						uni.showToast({
							icon: 'none',
							title: '成功',
						})
					},
					fail: () => {
						uni.showToast({
							icon: 'none',
							title: '失败',
						})
					}
				})
			},

			goWithdraw() {
				if (this.user.invite_balance === 0) {
					uni.showToast({
						icon: 'none',
						title: '余额不足',
					})
					return
				}

				uni.navigateTo({
					url: '/pages/member/ib_withdraw',
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}

	.user-info {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 15px;
		background: linear-gradient(180deg, rgba(23, 132, 237, 1) 0%, rgba(23, 132, 237, 1) 44%, #f2f2f2 100%);
	}

	.user-info>.info {
		width: 100%;
		height: auto;
		float: left;
		display: flex;
		margin-bottom: 15px;
	}

	.user-info>.info>.avatar {
		width: 36px;
		height: 36px;
		margin-right: 10px;
	}

	.user-info>.info>.avatar>image {
		width: 36px;
		height: 36px;
		border-radius: 50%;
	}

	.user-info>.info>.nickname {
		flex: 1;
		font-size: 14px;
		font-weight: 600;
		line-height: 36px;
		color: white;
	}

	.user-info>.data {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px;
		border-radius: 15px;
		background-color: white;
		display: flex;
	}

	.user-info>.data>.people-count {
		flex: 1;
	}

	.user-info>.data>.people-count>.value {
		text-align: center;
		font-size: 16px;
		font-weight: 500;
		line-height: 1;
		margin-bottom: 15px;
	}

	.user-info>.data>.people-count>.name {
		text-align: center;
		font-size: 12px;
		font-weight: normal;
	}

	.user-info>.data>.balance-sum {
		flex: 1;
	}

	.user-info>.data>.balance-sum>.value {
		text-align: center;
		font-size: 16px;
		font-weight: 500;
		line-height: 1;
		margin-bottom: 15px;
	}

	.user-info>.data>.balance-sum>.name {
		text-align: center;
		font-size: 12px;
		font-weight: normal;
	}

	.user-info>.data>.buttons {
		margin-left: 15px;
		padding-top: 10px;
	}

	.user-info>.data>.buttons>.withdraw {
		display: inline-block;
		padding: 5px 15px;
		font-size: 14px;
		font-weight: normal;
		background-color: white;
		border: 1px solid #1784ED;
		border-radius: 15px;
		color: #1784ED;
	}


	.promo_code-box {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 15px;
		box-sizing: border-box;
		padding-left: 15px;
		padding-right: 15px;
	}

	.promo_code-box>.promo_code {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px;
		background-color: white;
		border-radius: 15px;
	}

	.promo_code-box>.promo_code>.content {
		width: 100%;
		height: auto;
		float: left;
		text-align: center;
	}

	.promo_code-box>.promo_code>.content>.value {
		font-size: 16px;
		font-weight: 600;
		color: #333;
	}

	.promo_code-box>.promo_code>.content>.create-promo_code {
		display: block;
		width: 100%;
		height: 36px;
		background-color: #1784ED;
		line-height: 36px;
		color: white;
		text-align: center;
		border-radius: 18px;
	}

	.promo_code-box>.promo_code>.buttons {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 30px;
	}

	.promo_code-box>.promo_code>.buttons>.copy {
		display: block;
		width: 100%;
		height: 36px;
		background-color: #1784ED;
		line-height: 36px;
		color: white;
		text-align: center;
		border-radius: 18px;
	}

	.promo_code-box>.promo_code>.desc {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 30px;
		font-size: 12px;
		color: rgba(0, 0, 0, .6);
		line-height: 20px;
	}
</style>
