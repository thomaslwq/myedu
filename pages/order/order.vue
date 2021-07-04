<template>
	<view>
		<view class="goods">
			<view class="name">{{goods.name}}</view>
			<view class="charge">￥{{goods.charge}}</view>
		</view>

		<view class="promo_code" @click.stop="showPromoCodeShadow">
			<view class="title">使用优惠码</view>
			<view class="value">{{promo_code || '未使用'}}</view>
		</view>

		<view class="stat">
			<view class="item">
				<view class="name">原价</view>
				<view class="value">￥{{goods.charge}}</view>
			</view>
			<view class="item">
				<view class="name">优惠码抵扣</view>
				<view class="value">-￥{{promo_code_charge}}</view>
			</view>
			<view class="item">
				<view class="name">总计</view>
				<view class="value">￥{{total - promo_code_charge}}</view>
			</view>
		</view>

		<view class="bottom-bar">
			<view class="total">
				<text>￥{{total - promo_code_charge}}</text>
			</view>
			<view class="buttons">
				<text class="pay" @click.stop="paySubmit">确认支付</text>
			</view>
		</view>

		<view class="promo_code_shadow_box" :hidden="promoCodeShadowStatus===false">
			<view class="promo_code_box">
				<view class="input">
					<input type="number" placeholder="请输入邀请码" v-model="promo_code" />
				</view>
				<view class="check-button" @click.stop="promoCodeCheck">
					检测是否可用
				</view>
				<view class="cancel-button" @click.stop="hidePromoCodeShadow">取消</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		order
	} from '@/api/index'

	export default {
		data() {
			return {
				goods: {
					id: 0,
					name: '',
					charge: 0,
					type: ''
				},
				total: 0,
				promo_code: '',
				promo_code_charge: 0,
				promoCodeShadowStatus: false
			};
		},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.goods.id = options.id;
			this.goods.name = options.name;
			this.goods.charge = options.total;
			this.goods.type = options.type;
			this.total = options.total;
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			if (!uni.getStorageSync('access_token')) {
				uni.navigateTo({
					url: '/pages/auth/auth',
				})
			}
		},
		methods: {
			showPromoCodeShadow() {
				this.promoCodeShadowStatus = true;
			},

			hidePromoCodeShadow() {

				this.promoCodeShadowStatus = false;

			},

			promoCodeCheck() {
				if (this.promo_code.length === 0) {
					this.promoCodeShadowStatus = false;
					this.promo_code_charge = 0;
					this.promo_code = '';

				} else {
					order.promoCodeCheck(this.promo_code).then(res => {
						if (res.can_use === 0) {
							uni.showToast({
								icon: 'none',
								title: '优惠码不可用',
							})
						} else {
							this.promoCodeShadowStatus = false;
							this.promo_code_charge = res.promo_code.invited_user_reward;

						}
					})
				}
			},

			// inputPromoCode(e) {
			// 	this.setData({
			// 		promo_code: e.detail.value
			// 	});
			// },

			paySubmit() {
				if (this.goods.type === 'role') {
					order.role(this.goods.id, this.promo_code).then(res => {
						this.payHandler(res);
					})
				} else if (this.goods.type === 'course') {
					order.course(this.goods.id, this.promo_code).then(res => {
						this.payHandler(res);
					})
				} else if (this.goods.type === 'video') {
					order.video(this.goods.id, this.promo_code).then(res => {
						this.payHandler(res);
					})
				}
			},

			payHandler(orderData) {
				if (orderData.status_text === '已支付') {
					// 这种情况是优惠码全部抵扣
					uni.showToast({
						icon: 'none',
						title: '支付成功',
					})
					setTimeout(() => {
						// 返回上一页
						uni.navigateBack({
							delta: 0,
						})
					}, 500);
					return
				}

				// 未支付 -> 需要吊起小程序支付
				order.pay(orderData.order_id).then(res => {
					uni.requestPayment({
						nonceStr: res.nonceStr,
						package: res.package,
						paySign: res.paySign,
						timeStamp: res.timeStamp,
						signType: res.signType,
						success: (res) => {
							console.log('支付成功', res);
							uni.showToast({
								icon: 'none',
								title: '支付成功',
							})
							setTimeout(() => {
								// 返回上一页
								uni.navigateBack({
									delta: 0,
								})
							}, 500);
						},
						fail: (res) => {
							console.log('支付失败', res);
							uni.showToast({
								icon: 'none',
								title: '支付失败',
							})
						}
					})
				}).catch(e => {
					uni.showToast({
						icon: 'none',
						title: '错误：' + e,
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}

	.goods {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 15px;
		box-sizing: border-box;
		padding: 30px 15px;
		background-color: white;
		display: flex;
	}

	.goods>.name {
		flex: 1;
		font-size: 14px;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goods>.charge {
		margin-left: 15px;
		font-size: 12px;
		color: red;
		font-weight: 500;
		line-height: 1;
	}

	.promo_code {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px;
		background-color: white;
		display: flex;
		margin-top: 15px;
	}

	.promo_code>.title {
		flex: 1;
		font-size: 12px;
		color: #333;
		line-height: 1;
	}

	.promo_code>.value {
		margin-left: 15px;
		font-size: 12px;
		line-height: 1;
		color: #333;
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 50px;
		box-sizing: border-box;
		border-top: 1px solid #f2f2f2;
		display: flex;
		background-color: white;
	}

	.bottom-bar>.total {
		margin-right: 15px;
		font-size: 16px;
		font-weight: 500;
		line-height: 49px;
		padding-left: 15px;
		color: red;
	}

	.bottom-bar>.buttons {
		flex: 1;
		text-align: right;
		box-sizing: border-box;
		padding-right: 15px;
	}

	.bottom-bar>.buttons>.pay {
		display: inline-block;
		width: 144px;
		height: 40px;
		line-height: 40px;
		margin-top: 5px;
		background-color: #1784ED;
		border-radius: 20px;
		text-align: center;
		font-size: 14px;
		color: white;
	}

	.stat {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 30px 15px 15px 15px;
		background-color: white;
		margin-top: 15px;
	}

	.stat>.item {
		width: 100%;
		height: auto;
		float: left;
		margin-bottom: 15px;
		display: flex;
	}

	.stat>.item>.name {
		flex: 1;
		text-align: left;
		font-size: 12px;
		line-height: 1;
		color: #333;
	}

	.stat>.item>.value {
		margin-left: 15px;
		font-size: 12px;
		line-height: 1;
		color: red;
	}

	.promo_code_shadow_box {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		background-color: rgba(0, 0, 0, .5);
	}

	.promo_code_shadow_box>.promo_code_box {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: auto;
		box-sizing: border-box;
		padding: 50px 15px 15px 15px;
		background-color: white;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
	}

	.promo_code_shadow_box>.promo_code_box>.input {
		width: 100%;
		height: auto;
		float: left;
		margin-bottom: 15px;
	}

	.promo_code_shadow_box>.promo_code_box>.input>input {
		width: 100%;
		height: 42px;
		border: 0;
		border-bottom: 1px solid #f2f2f2;
		box-sizing: border-box;
		padding: 3px 5px;
		font-size: 14px;
	}

	.promo_code_shadow_box>.promo_code_box>.check-button {
		width: 100%;
		height: 42px;
		line-height: 42px;
		float: left;
		margin-bottom: 15px;
		background-color: #1784ED;
		color: white;
		text-align: center;
		border-radius: 21px;
		font-size: 14px;
	}

	.promo_code_shadow_box>.promo_code_box>.cancel-button {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		color: #aaa;
		line-height: 36px;
		text-align: center;
	}
</style>
