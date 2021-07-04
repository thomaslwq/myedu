<template>
	<view>
		<!--logo栏目开始-->
		<view class="topbar">
			<image src="@/static/images/logo.png" class="logo" />
			<view class="search-bar" @tap="goSearch">
				<image src="@/static/images/icons/search.png" class="search-bar-icon" />
				<view class="text">搜索您想要的</view>
			</view>
		</view>
		<!--logo 栏目结束-->
		<!--幻灯片栏-->
		<view class="swiper-box">
			<swiper indicator-dots="true" autoplay="true" indicator-color="rgba(0,0,0,.2)"
				indicator-active-color="rgba(255,255,255,1)">
				<swiper-item v-for="(item,index) in sliders" :key="item.id">
					<image class="swiper-image-item" :src="item.thumb" @tap="goPage(index)" />
				</swiper-item>
			</swiper>
		</view>
		<!--幻灯片结束-->
		<!--首页推荐开始-->
		<view class="index-banners-box">
			<view class="index-banner-item" v-for="(banner,index) in banners"  :key="course.id">
				<view class="title">{{banner.name}}</view>
				<view class="courses-box">
					<edu-course :name="course.title" :thumb="course.thumb" :course_id="course.id" :charge="course.charge"
						:user-count="course.user_count" :category="course.category.name" v-for="(course,i) in banner.courses"
						:key="course.id"></edu-course>
				</view>
			</view>
		</view>
		<!--首页推荐结束-->
	</view>
</template>

<script>
	import {
		home
	} from '@/api/index.js'
	import EduCourse from "@/components/edu-course.vue"
	const app = getApp();
	// console.log(app.globalData)
	export default {
		components:{
			"edu-course":EduCourse
		},
		created(){
			home.indexBanners().then(res => {
				this.banners = res;
			})

			home.sliders().then(res => {
				console.log(res);
				this.sliders = res;
			})
		},
		data: function(){
			return {
				sliders: [],
				banners: []
			}
		},
		methods: {
			goSearch() {
				uni.navigateTo({
					url: '/pages/search/search',
				})
			},
			goPage(index) {
				let page = this.sliders[index].url;
				uni.navigateTo({
					url: page,
				})
			}
		}
	}
</script>

<style scoped>
	page {
		background-color: #f2f2f2;
	}

	.topbar {
		width: 100%;
		height: 43px;
		float: left;
		box-sizing: border-box;
		padding: 2px 15px 0 15px;
		background-color: white;
		display: flex;
	}

	.topbar .logo {
		width: 91px;
		height: 24px;
		margin-top: 5px;
		margin-right: 15px;
	}

	.topbar .search-bar {
		flex: 1;
		box-sizing: border-box;
		padding-right: 15px;
		height: 33px;
		background-color: rgba(238, 238, 238, 1);
		border-radius: 18px;
		display: flex;
	}


	.topbar>.search-bar>.search-bar-icon {
		width: 15px;
		height: 15px;
		margin-top: 9px;
		margin-left: 15px;
	}

	.topbar>.search-bar>.text {
		flex: 1;
		height: 13px;
		font-size: 13px;
		line-height: 1;
		font-weight: 400;
		color: rgba(204, 204, 204, 1);
		margin-left: 11px;
		margin-top: 9px;
	}

	/* 幻灯片 */
	.swiper-box {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding: 8px 15px;
		background-color: white;
	}

	.swiper-image-item {
		width: 100%;
		height: 140px;
		float: left;
		border-radius: 4px;
	}

	/* 首页推荐 */
	.index-banners-box {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 15px;
		padding-bottom: 50px;
	}

	.index-banners-box>.index-banner-item {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		padding-left: 15px;
		padding-right: 15px;
		background-color: white;
		margin-bottom: 15px;
	}

	.index-banners-box>.index-banner-item>.title {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 22px;
		margin-bottom: 10px;
		font-size: 18px;
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
		line-height: 18px;
	}

	.index-banners-box>.index-banner-item>.courses-box {
		width: 100%;
		height: auto;
		float: left;
	}
</style>
