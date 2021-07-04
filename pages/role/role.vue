<template>
	<view>
		<view class="user-info" v-if="user!==null">
			<view class="avatar">
				<image :src="user.avatar" />
			</view>
			<view class="role">
				<view class="role-date" v-if="user.role">
					您的{{user.role.name}}会员将于{{user.role_expired_at}}到期
				</view>
				<view class="role-date" v-else>
					您当前为免费会员
				</view>
				<view class="desc">
					购买后有效期顺延
				</view>
			</view>
		</view>

		<view class="role-box">
			<view :class="['item',order.id === role.id ? 'active' : '',index === roles.length-1 ? 'last' : '']"
				v-for="(role,index) in roles" :key="role.id"  @click.stop="choice(role)">
				<view class="name">{{role.name}}</view>
				<view class="charge">￥{{role.charge}}</view>
				<view class="days">{{role.expire_days}}天</view>
			</view>
		</view>
		<view class="bottom-bar">
			<block v-if="isIos">
				<view class="ios-alert">因苹果政策原因无法购买会员</view>
			</block>
			<block v-else>
				<view class="total-charge">
					<text class="value">￥{{order.total}}</text>
				</view>
				<view class="buy-button" @click="buy">立即购买</view>
			</block>
		</view>
	</view>
</template>
<script>
	import {
		user,
		role
	} from '@/api/index'
	import util from '@/utils/util'
	export default {
		data() {
			return {
				user: null,
				roles: [],
				order: {
					id: 0,
					name: '',
					total: 0
				},
				isIos: util.isIos()
			}
		},
		onShow: function() {
			this.getUser();
			this.roleList();
		},

		methods: {
			getUser() {
				user.info().then(res => {
					this.user = res;
				});
			},

			roleList() {
				role.list().then(res => {
					this.roles = res;
				})
			},

			choice(data) {
				let id = data.id;
				let charge = data.charge;
				let name = data.name;
				this.order.id = id;
				this.order.total = charge;
				this.order.name = name;
			},

			buy() {
				if (this.order.id === 0) {
					uni.showToast({
						icon: 'none',
						title: '请选择会员',
					})
					return;
				}
				uni.navigateTo({
					url: `/pages/order/order?id=${this.order.id}&total=${this.order.total}&name=${this.order.name}&type=role`,
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #f2f2f2;
	}

	.user-info {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		background-color: white;
		padding: 20px 15px;
		display: flex;
	}

	.user-info>.avatar {
		width: 48px;
		height: 48px;
		margin-right: 15px;
	}

	.user-info>.avatar>image {
		width: 48px;
		height: 48px;
		border-radius: 50%;
	}

	.user-info>.role {
		width: 100%;
		height: auto;
		float: left;
		padding-top: 4px;
	}

	.user-info>.role>.role-date {
		width: 100%;
		height: auto;
		float: left;
		font-size: 13px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 20px;
	}

	.user-info>.role>.desc {
		width: 100%;
		height: auto;
		float: left;
		font-size: 13px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 20px;
	}

	.role-box {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 20px 15px;
		display: flex;
		margin-top: 10px;
		background-color: white;
	}

	.role-box>.item {
		flex: 1;
		box-sizing: border-box;
		padding: 20px;
		border-radius: 7px;
		border: 1px solid rgba(204, 204, 204, 1);
		color: #333333;
		text-align: center;
		margin-right: 10px;
	}

	.role-box>.item.last {
		margin-right: 0;
	}

	.role-box>.item.active {
		border: 1px solid #CEA200;
		color: #CEA200;
	}

	.role-box>.item>.name {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		font-weight: 600;
		margin-bottom: 15px;
	}

	.role-box>.item>.charge {
		width: 100%;
		height: auto;
		float: left;
		font-size: 14px;
		font-weight: 600;
		color: rgba(206, 162, 0, 1);
		margin-bottom: 15px;
	}

	.role-box>.item>.days {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 11;
		display: flex;
		width: 100%;
		height: 49px;
		background-color: white;
	}

	.bottom-bar>.ios-alert {
		flex: 1;
		text-align: center;
		font-size: 12px;
		color: #aaa;
		line-height: 49px;
	}

	.bottom-bar>.total-charge {
		flex: 1;
		box-sizing: border-box;
		padding-left: 15px;
	}

	.bottom-bar>.total-charge>.value {
		font-size: 16px;
		font-weight: 500;
		color: rgba(255, 77, 79, 1);
		line-height: 49px;
	}

	.bottom-bar>.buy-button {
		width: 144px;
		height: 49px;
		background: #000;
		color: white;
		font-size: 14px;
		line-height: 49px;
		text-align: center;
	}
</style>
