<template>
	<view>
		<view class="search-bar">
			<view class="input">
				<input class="search-input" placeholder="输入关键字" confirm-type="search" v-model="keywords" />
			</view>
			<view class="button" @tap="search">
				<text>搜索</text>
			</view>
		</view>
		<view class="search-result">
			<view class="title">搜索结果</view>
			<view class="result" v-if="courses.length">
				<edu-course :name="course.title" :thumb="course.thumb" :id="course.id" :charge="course.charge"
					:user-count="course.user_count" :category="course.category.name" v-for="(course,index) in courses"
					:key="course.id"></edu-course>
			</view>
			<view class="result" v-else>
				<edu-none></edu-none>
			</view>
		</view>
	</view>
</template>

<script>
		import {home} from '@/api/index'
		import EduCourse from "@/components/edu-course.vue"
		import EduNone from "@/components/edu-none.vue"
	export default {
		components:{
			"edu-course":EduCourse,
			 "edu-none":EduNone
		},
		data() {
			return {
				courses: [],
				keywords: ''
			}
		},
		methods: {
			search() {
				if (this.keywords.length === 0) {
					uni.showToast({
						title: '请输入关键字',
						icon: 'none'
					})
					return;
				}

				home.search({
					keywords: this.keywords
				}).then(res => {
					this.courses = res.data
				})
			}
		}
	}
</script>

<style scoped>
	@import "../../static/assets/fonts/iconfont.css";

	page {
		background-color: #f2f2f2;
	}

	.search-bar {
		width: 100%;
		height: 52px;
		box-sizing: border-box;
		padding: 10px 8px;
		background-color: white;
		display: flex;
	}

	.search-bar>.input {
		flex: 1;
	}

	.search-bar>.input>.search-input {
		width: 100%;
		height: 32px;
		background: rgba(242, 242, 242, 1);
		border-radius: 18px;
		box-sizing: border-box;
		padding: 3px 15px;
		font-size: 14px;
	}

	.search-bar>.button {
		padding-left: 15px;
		font-size: 16px;
		color: #333;
		font-weight: 400;
		line-height: 32px;
	}

	.search-result {
		width: 100%;
		height: auto;
		float: left;
		background-color: white;
		box-sizing: border-box;
		padding: 20px 15px;
		margin-top: 15px;
	}

	.search-result>.title {
		width: 100%;
		height: auto;
		float: left;
		font-size: 16px;
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
		line-height: 16px;
		margin-bottom: 10px;
	}
</style>
