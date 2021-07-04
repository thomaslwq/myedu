<template>
	<view class="course-item" @tap="goDetail">
		<view class="course-thumb">
			<image :src="thumb" />
		</view>
		<view class="course-info-box">
			<view class="course-name">{{name}}</view>
			<view class="course-info">
				<view class="user-count">
					<text class="iconfont iconsubscribe"></text>
					<text>{{userCount}}</text>
				</view>
				<view class="category">
					<text class="iconfont icontag1"></text>
					<text>{{category}}</text>
				</view>
			</view>
			<view class="course-charge" v-if="!isIos">
				<text class="charge">￥{{charge}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util'
	export default {
		name: "edu-course",
		props: {
			name: {
				type: String,
				value: '',
			},
			thumb: {
				type: String,
				value: '',
			},
			userCount: {
				type: Number,
				value: 0,
			},
			category: {
				type: String,
				value: '',
			},
			charge: {
				type: Number,
				value: 0,
			},
			course_id: {
				type: Number,
				value: 0,
			}
		},
		data: function(){
			return {
				isIos: util.isIos()
			}
		},
		methods: {
			goDetail() {
				uni.navigateTo({
					url: '/pages/course/detail?id=' + this.course_id,
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	 @import "../static/assets/fonts/iconfont.css";

	.course-item {
		width: 100%;
		height: auto;
		float: left;
		padding-top: 15px;
		padding-bottom: 15px;
		display: flex;
	}

	.course-item>.course-thumb {
		width: 100px;
		height: 75px;
		margin-right: 20px;
	}

	.course-item>.course-thumb image {
		width: 100px;
		height: 75px;
		border-radius: 3px;
	}

	.course-item>.course-info-box {
		flex: 1;
	}

	.course-item>.course-info-box>.course-name {
		width: 100%;
		height: auto;
		float: left;
		font-size: 15px;
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
		line-height: 15px;

		margin-bottom: 12px;
	}

	.course-item>.course-info-box>.course-info {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 12px;
		margin-bottom: 12px;
		display: flex;
	}

	.course-item>.course-info-box>.course-info>.user-count {
		width: auto;
		margin-right: 10px;
	}

	.course-item>.course-info-box>.course-info>.user-count>.iconfont {
		margin-right: 3px;
		font-size: 10px;
	}

	.course-item>.course-info-box>.course-info>.category {
		flex: 1;
	}

	.course-item>.course-info-box>.course-info>.category>.iconfont {
		margin-right: 3px;
		font-size: 10px;
	}

	.course-item>.course-info-box>.course-charge {
		width: 100%;
		height: auto;
		float: left;
	}

	.course-item>.course-info-box>.course-charge>.charge {
		display: inline-block;
		width: auto;
		height: auto;
		padding-left: 10px;
		padding-right: 10px;
		background: rgba(245, 245, 245, 1);
		border-radius: 11px;
		font-size: 12px;
		font-weight: 400;
		color: rgba(255, 77, 79, 1);
		line-height: 20px;
	}
</style>
