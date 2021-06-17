<script>
	import {
		base
	} from "./api/index.js"
	export default {
		onLaunch: function() {
			console.log('App Launch');
			base.config().then(res => {
				console.log(res);
				// 系统的基本配置项
				this.globalData.user_protocol = res.user_protocol;
				this.globalData.user_private_protocol = res.user_private_protocol;
				this.globalData.aboutus = res.aboutus;
				this.globalData.player_cover = res.player.cover;
				console.log(this.globalData)
			})
			// 小程序 seesion
			// uni.login({
			// 	success: (res) => {
			// 		base.wxLogin({
			// 			code: res.code
			// 		}).then(res => {
			// 			uni.setStorageSync("openid", res.openid);
			// 		})
			// 	}
			// })
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			AppName: "MyEdu",
			Version: "1.0",
			user_protocol: "",
			user_private_protocol: "",
			aboutus: "",
			player_cover: ""
		}
	}
</script>

<style>
	/*每个页面公共css */

	/*  #ifdef  MP-WEIXIN  */
	view,
	page,
	navigator,
	button,
	swiper,
	swiper-item {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
	}

	page {
		background-color: #f2f2f2;
	}
	/*  #endif  */
	
	 *{
		 padding:0;
		 margin:0;
		 box-sizing: border-box;
	 }
</style>
