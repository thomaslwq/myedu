<template>
	<view>

		<view class="login-button-box">
			<button v-if="step1" @click="getUserInfo" class="login-button">微信授权</button>
			<button v-if="step2" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
				class="login-button">绑定手机号</button>
		</view>

		<view class="protocol">
			登录即代表您同意 <text @click.stop="openUserProtocol">用户协议</text> 和 <text
				@click.stop="openUserPrivateProtocol">隐私协议</text>
		</view>
	</view>
</template>

<script>
	import {
		login
	} from '@/api/index'
	export default {
		onLoad: function(options) {
			let redirect = options.redirect;
			if (redirect) {
				redirect = decodeURIComponent(redirect);

				this.redirect = redirect;

			}
		},
		data() {
			return {
				step1: true,
				step2: false,
				redirect: null,
				userInfo: null
			}
		},
		methods: {

			getUserInfo() {
				uni.getUserProfile({
					desc: "用于用户登录",
					success: (result) => {
						
						// 缓存用户信息后面手机号登录用得到
						this.userInfo = result;
						login.wxLogin({
							openid: uni.getStorageSync('openid'),
							iv: result.iv,
							rawData: result.rawData,
							signature: result.signature,
							encryptedData: result.encryptedData
						}).then(res => {
							uni.setStorageSync('access_token', res.token);
							if (this.redirect) {
								uni.redirectTo({
									url: this.redirect,
								})
							} else {
								uni.navigateBack({
									delta: 0,
								})
							}
						}).catch(e => {
							this.step1 = false;
							this.step2 = true;
							wx.showToast({
								icon: 'none',
								title: '请绑定手机号',
							})
						});
					},
					fail: function(err) {
						uni.showToast({
							icon: 'none',
							title: '您拒绝了授权',
						})
					}
				})

			},
			getPhoneNumber(e) {
				debugger
				let data = e.detail;
				login.wxMobileLogin({
					openid: wx.getStorageSync('openid'),
					iv: data.iv,
					encryptedData: data.encryptedData,
					userInfo: {
						rawData: this.userInfo.rawData,
						signature: this.userInfo.signature,
						encryptedData: this.userInfo.encryptedData,
						iv: this.userInfo.iv
					}
				}).then(res => {
					wx.setStorageSync('access_token', res.token);
					if (this.redirect) {
						wx.redirectTo({
							url: this.redirect,
						})
					} else {
						wx.navigateBack({
							delta: 0,
						})
					}
				})
			},

			openUserProtocol() {
				wx.navigateTo({
					url: '/pages/web/web?url=' + app.globalData.user_protocol,
				})
			},

			openUserPrivateProtocol() {
				wx.navigateTo({
					url: '/pages/web/web?url=' + app.globalData.user_private_protocol,
				})
			},
		}
	}
</script>

<style>
	.login-button-box {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 100px;
		box-sizing: border-box;
		padding-left: 15px;
		padding-right: 15px;
	}


	.login-button-box>.login-button {
		display: block;
		width: 100%;
		height: 42px;
		line-height: 42px;
		float: left;
		background-color: #0b76de;
		color: white;
		text-align: center;
		font-size: 14px;
		border-radius: 3px;
	}

	.protocol {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding-left: 15px;
		padding-right: 15px;
		margin-top: 30px;
		color: #aaa;
		font-size: 12px;
	}

	.protocol>text {
		color: blue;
		font-weight: 300;
	}
</style>
