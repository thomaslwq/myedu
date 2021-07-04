<template>
	<view>
		<view class="user-banner">

			<view class="user-info" @click="goLogin" v-if="!user">
				<view class="avatar">
					<image src="@/static/images/default_avatar.png" />
				</view>
				<view class="info">
					<view class="nickname">请登录</view>
					<view class="role">
						<text class="role-text">登录后查看</text>
					</view>
				</view>
			</view>

			<view class="user-info" v-else>
				<view class="avatar">
					<image :src="user.avatar" />
				</view>
				<view class="info">
					<view class="nickname">{{user.nick_name}}</view>
					<view class="role">
						<text class="role-text">{{user.role ? user.role.name : '免费会员'}}</text>
					</view>
				</view>
			</view>

			<view class="member-banners">
				<view class="item" @click="goPage($event)" data-page="/pages/member/order">
					<view class="icon">
						<image src="@/static/images/icons/member/order.png" />
					</view>
					<view class="name">
						<text>我的订单</text>
					</view>
				</view>

				<view class="item" @click="goPage($event)" data-page="/pages/member/collect">
					<view class="icon">
						<image src="@/static/images/icons/member/collect.png" />
					</view>
					<view class="name">
						<text>我的收藏</text>
					</view>
				</view>

				<view class="item" @click="goPage($event)" data-page="/pages/member/message">
					<view class="icon">
						<image src="@/static/images/icons/member/message.png" />
					</view>
					<view class="name">
						<text>我的消息</text>
					</view>
				</view>

				<view class="item" @click="goPage($event)" data-page="/pages/role/role">
					<view class="icon">
						<image src="@/static/images/icons/member/role.png" />
					</view>
					<view class="name">
						<text>会员中心</text>
					</view>
				</view>
			</view>

			<view class="role-expired-at">
				<view class="icon">
					<image src="@/static/images/icons/vip.png" />
				</view>
				<view class="text" v-if="!user">
					登录后查看
				</view>
				<view class="text" v-else-if="user.role">
					您的会员{{user.role_expired_at}}到期
				</view>
				<view class="text" v-else>
					<text>开通会员享更多课程特权</text>
					<text class="detail" @click="goPage($event)" data-page="/pages/role/index">了解详情</text>
				</view>
			</view>

		</view>
		<view class="member-menus-box">
			<view class="member-menus">
				<view class="item" @click="goPage($event)" data-page="/pages/member/course">
					我的课程
				</view>
				<view class="item" @click="goPage($event)" data-page="/pages/member/promoCode">
					我的邀请
				</view>
				<view class="item" @click="goPage($event)" data-page="/pages/member/credit1">
					我的积分
				</view>
				<view class="item" @click="goPage($event)" data-page="/pages/member/setting">
					设置
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		user
	} from '@/api/index'
	import util from '@/utils/util.js'
	export default {
		data() {
			return {
				token: wx.getStorageSync('access_token'),
				user: null
			}
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getUser();
		},
		methods: {
			getUser() {
				if (uni.getStorageSync('access_token')) {
					user.info().then(res => {
						this.user =  res
					});
				}
			},

			goLogin() {
				uni.navigateTo({
					url: '/pages/auth/auth',
				})
			},

			goPage(e) {
				let page = e.currentTarget.dataset.page;
				util.go(page, true)
			}
		}
	}
</script>

<style>
	page {
		background-color: #f2f2f2;
	}

	.user-banner {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px 0 15px;
		background: linear-gradient(180deg, rgba(23, 132, 237, 1) 0%, rgba(23, 132, 237, 1) 44%, #f2f2f2 100%);
	}

	.user-banner>.user-info {
		width: 100%;
		height: auto;
		float: left;
		display: flex;
	}

	.user-banner>.user-info>.avatar {
		width: 64px;
		height: 64px;
		margin-right: 15px;
	}

	.user-banner>.user-info>.avatar>image {
		width: 64px;
		height: 64px;
		border-radius: 50%;
	}

	.user-banner>.user-info>.info {
		flex: 1;
	}

	.user-banner>.user-info>.info>.nickname {
		width: 100%;
		height: auto;
		float: left;
		padding-top: 6px;
		font-size: 16px;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		line-height: 16px;
		letter-spacing: 1px;
		margin-bottom: 18px;
	}

	.user-banner>.user-info>.info>.role {
		width: 100%;
		height: auto;
		float: left;
	}

	.user-banner>.user-info>.info>.role>.role-text {
		display: inline;
		padding: 2px 15px;
		background-color: rgba(255, 255, 255, .3);
		border-radius: 12px;
		font-size: 13px;
		font-weight: 400;
		color: rgba(255, 255, 255, 1);
		line-height: 1;
	}

	.user-banner>.member-banners {
		width: 100%;
		height: auto;
		float: left;
		background: rgba(255, 255, 255, 1);
		border-radius: 8px 8px 0px 0px;
		margin-top: 30px;
		padding: 20px;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
	}

	.user-banner>.member-banners>.item {
		flex: 1;
		text-align: center;
	}

	.user-banner>.member-banners>.item>.icon {
		width: 100%;
		height: auto;
		float: left;
		text-align: center;
		margin-bottom: 15px;
	}

	.user-banner>.member-banners>.item>.icon>image {
		width: 36px;
		height: 36px;
	}

	.user-banner>.member-banners>.item>.name {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		text-align: center;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 1;
	}

	.user-banner>.role-expired-at {
		width: 100%;
		height: auto;
		float: left;
		display: flex;
		box-sizing: border-box;
		padding: 10px 15px;
		background: rgba(255, 230, 180, 1);
		border-radius: 0px 0px 8px 8px;
	}

	.user-banner>.role-expired-at>.icon {
		margin-right: 10px;
	}

	.user-banner>.role-expired-at>.icon>image {
		width: 24px;
		height: 19px;
	}

	.user-banner>.role-expired-at>.text {
		flex: 1;
		font-size: 13px;
		font-weight: 400;
		color: rgba(213, 124, 31, 1);
		line-height: 19px;
		padding-top: 3px;
	}

	.user-banner>.role-expired-at>.text>.detail {
		display: block;
		width: 76px;
		height: 25px;
		float: right;
		margin-top: -3px;
		background: linear-gradient(90deg, rgba(236, 179, 66, 1) 0%, rgba(213, 124, 31, 1) 100%);
		border-radius: 15px;
		font-size: 13px;
		box-sizing: border-box;
		padding: 6px 10px;
		font-weight: 400;
		color: rgba(248, 250, 251, 1);
		line-height: 1;
	}

	.member-menus-box {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		margin-top: 10px;
		padding-left: 15px;
		padding-right: 15px;
		padding-bottom: 60px;
	}

	.member-menus-box>.member-menus {
		width: 100%;
		height: auto;
		float: left;
		background-color: white;
		border-radius: 8px;
	}

	.member-menus-box>.member-menus>.item {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 20px;
		font-size: 15px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 1;
	}
</style>
