<template>
	<view>
		<view class="setting-box">
			<view class="item" @click="openUserProtocol">用户协议</view>
			<view class="item last" @click="openUserPrivateProtocol">隐私协议</view>
		</view>

		<view class="setting-box">
			<view class="item last" @click="openAboutUs">关于我们</view>
		</view>

		<view class="setting-box">
			<view class="item last">小程序版本 v2.0.2-beta</view>
		</view>
	</view>
</template>
<script>
	const app = getApp();
	export default {
		components: {

		},
		data() {
			return {
	
			};
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
		},
		methods: {
			openUserProtocol() {
				uni.navigateTo({
					url: '/pages/web/web?url=' + app.globalData.user_protocol,
				})
			},

			openUserPrivateProtocol() {
				uni.navigateTo({
					url: '/pages/web/web?url=' + app.globalData.user_private_protocol,
				})
			},

			openAboutUs() {
				uni.navigateTo({
					url: '/pages/web/web?url=' + app.globalData.aboutus,
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}

	.setting-box {
		margin-top: 10px;
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding-left: 15px;
		padding-right: 15px;
		background-color: white;
		border-top: 1px solid #f2f2f2;
		border-bottom: 1px solid #f2f2f2;
	}

	.setting-box>.item {
		width: 100%;
		height: 50px;
		line-height: 50px;
		font-size: 14px;
		float: left;
		color: #333;
		border-bottom: 1px solid #f2f2f2;
	}

	.setting-box>.item.last {
		border-bottom: 0;
	}
</style>
