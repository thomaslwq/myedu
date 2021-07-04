<template>
	<view>
		<web-view class="webview" :src="url"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: ""
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.url = options.url
		},

		methods: {

		}
	}
</script>

<style>
	.webview {
		width: 100%;
		height: 100%;
		float: left;
	}
</style>
