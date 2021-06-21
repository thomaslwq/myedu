<template>
	<view>
		<view class="course-thumb">
			<image :src="course.thumb" />
		</view>
		<view class="navs">
			<view :class="['item',navTab === 'desc' ? 'active' : '']" @tap="switchNavTab($event)" data-tab="desc">课程介绍
			</view>
			<view :class="['item',navTab === 'menu' ? 'active' : '']" @tap="switchNavTab($event)" data-tab="menu">课程目录
			</view>
			<view :class="['item',navTab === 'comment' ? 'active' : '']" @tap="switchNavTab($event)" data-tab="comment">
				讨论区
			</view>
		</view>
		<!-- 课程介绍开始 -->
		<view class="desc" :hidden="navTab!=='desc'">
			<rich-text :nodes="course.render_desc"></rich-text>
		</view>
		<!-- 课程介绍结束 -->
		<!-- 课程目录开始 -->
		<view class="menus" :hidden="navTab!=='menu'">
			<block v-if="chapters.length === 0">
				<view class="video-item" v-for="(item,index) in videos[0]" :key="item.id" @tap="goVideo($event)"
					:data-video-id="item.id">
					<view class="name">
						<text class="free" v-if="item.charge===0">试看</text>
						{{item.title}}
					</view>
					<view class="duration">{{utils.durationForHuman(item.duration)}}</view>
				</view>
			</block>

			<block v-else>
				<view class="chapter-item" v-for="(chapter,index) in chapters" :key="chapter.id">
					<view class="chapter-name">{{chapter.title}}</view>
					<view class="video-item" v-for="(item,index) in videos[chapter.id]" :key="item.id" @tap="goVideo"
						:data-video-id="item.id">
						<view class="name">
							<text class="free" v-if="item.charge===0">试看</text>
							{{item.title}}
						</view>
						<view class="duration">{{utils.durationForHuman(item.duration)}}</view>
					</view>
				</view>
			</block>
		</view>
		<!-- 课程目录结束 -->
		<!-- 讨论区开始 -->
		<view class="comments" :hidden="navTab!=='comment'">
			<block v-if="comments.length > 0">
				<view class="comment-item" v-for="(comment,index) in comments" :key="comment.id">
					<view class="user">
						<view class="avatar">
							<image :src="commentUsers[comment.user_id].avatar" />
						</view>
						<view class="nickname">
							<view class="value">{{commentUsers[comment.user_id].nick_name}}</view>
							<view class="date">{{comment.created_at}}</view>
						</view>
					</view>
					<view class="content">
						<rich-text :nodes="comment.render_content"></rich-text>
					</view>
				</view>
			</block>
			<meedu-none v-else></meedu-none>
		</view>

		<view class="hr"></view>
		<!-- 讨论区结束 -->
		<view class="bottom-bar" :hidden="navTab === 'comment'">
			<view :class="['colletion', isCollect ? 'active' : '']" @tap="collectAction">
				<text class="iconfont iconlike"></text>
			</view>
			<view class="buttons">
				<block v-if="course.charge === 0 || isBuy === true">
					<text class="start-learn-button" bindtap="startLearn">开始学习</text>
				</block>
				<block v-else>
					<block v-if="isIos">
						<view class="ios-alert">因苹果政策原因无法购买课程</view>
					</block>
					<block v-else>
						<text class="buy-button" @tap="buy">购买课程 ￥{{course.charge}}</text>
						<text class="buy-role-button" @tap="goRole">开通会员免费看</text>
					</block>
				</block>
			</view>
		</view>

		<view class="comment-bottom-bar" :hidden="navTab !== 'comment'">
			<view class="input">
				<input type="text" placeholder="说点什么吧" v-model="commentContent" />
			</view>
			<view :class="['send-button',commentContent.length > 0 ? 'active' : '']" @tap="createComment">发布</view>
		</view>
	</view>
</template>
<script module="utils" lang="wxs">
	var formatTime = function(date) {
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()
		const hour = date.getHours()
		const minute = date.getMinutes()
		const second = date.getSeconds()

		return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(
			':')
	}

	var formatNumber = function(b) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}

	var durationForHuman = function(duration) {
		var minutes = parseInt(duration / 60);
		var seconds = duration % 10;
		if (minutes < 10) {
			minutes = minutes === 0 ? '00' : '0' + minutes
		}
		if (seconds < 10) {
			seconds = seconds === 0 ? '00' : '0' + seconds;
		}
		return minutes + ':' + seconds;
	}

	module.exports = {
		formatTime: formatTime,
		durationForHuman: durationForHuman
	}
</script>
<script>
	import {
		course
	} from '@/api/index'
	import util from '@/utils/util'
	import EduNone from "@/components/edu-none.vue"
	export default {
		components: {
			"meedu-none": EduNone
		},
		onShareAppMessage: function() {
			return {
				title: this.course.title,
				path: `/pages/course/detail?id=${this.courseId}`,
				imageUrl: this.course.thumb
			}
		},
		onLoad: function(options) {
			console.log(options);
			this.courseId = options.id
		},
		onShow() {
			this.getCourse();
			this.getComments();
		},
		data() {
			return {
				course: null,
				chapters: [],
				videos: [],
				attachs: [],
				navTab: 'desc',
				isCollect: false,
				isBuy: false,
				videoWatchedProgress: [],
				comments: [],
				commentUsers: [],
				courseId: 0,
				commentContent: '',
				isIos: util.isIos()
			};
		},
		methods: {
			collectAction() {
				if (!uni.getStorageSync('access_token')) {
					uni.navigateTo({
						url: '/pages/auth/auth',
					})
					return
				}

				course.like(this.courseId).then(res => {
					let status = res;
					this.isCollect = status === 0 ? false : true;
				});
			},
			switchNavTab(e) {
				let tab = e.currentTarget.dataset.tab;
				if (this.navTab === tab) {
					return;
				}
				this.navTab = tab;
			},
			getCourse() {
				course.detail(this.courseId).then(res => {
					uni.setNavigationBarTitle({
						title: res.course.title,
					})

					// 富文本图片溢出
					res.course.render_desc = res.course.render_desc.replace(/\<img/gi,
						'<img style="max-width:100%;height:auto" ');

					this.course = res.course,
						this.chapters = res.chapters,
						this.videos = res.videos,
						this.isBuy = res.isBuy,
						this.isCollect = res.isCollect,
						this.attachs = res.attachs,
						this.videoWatchedProgress = res.videoWatchedProgress

				})
			},
			getComments() {
				course.comments(this.courseId).then(res => {
					this.commentUsers = res.users,
						this.comments = res.comments
				})
			},
			goRole() {
				util.go('/pages/role/role', true);
			},

			createComment() {
				if (!uni.getStorageSync('access_token')) {
					uni.navigateTo({
						url: '/pages/auth/auth',
					})
					return
				}

				if (this.commentContent.length === 0) {
					uni.showToast({
						icon: 'none',
						title: '请输入内容',
					})
					return
				}

				course.createComment(this.courseId, {
					content: this.commentContent
				}).then(() => {

					this.commentContent = '';
					this.getComments();
					uni.showToast({
						icon: 'none',
						title: '成功，审核通过将会展示',
					})
				}).catch(e => {
					uni.showToast({
						icon: 'none',
						title: e,
					})
				})
			},

			goVideo(e) {
				let videoId = e.currentTarget.dataset.videoId;
				console.log(videoId);
				util.go('/pages/vedio/video?id=' + videoId, true);
			},

			buy() {
				util.go(`/pages/order/index?id=${this.course.id}&total=${this.course.charge}&name=${this.course.title}&type=course`,
					true);
			},

			startLearn() {
				if (this.data.videos.length === 0) {
					wx.showToast({
						icon: 'none',
						title: '暂无视频',
					})
					return
				}

				let video = null;

				if (this.data.chapters.length > 0) {
					// 有配置章节
					video = this.data.videos[this.data.chapters[0].id][0];
				} else {
					// 无章节
					video = this.data.videos[0][0];
				}

				util.go('/pages/course/video?id=' + video.id, true);
			}
		}
	}
</script>

<style lang="less">
	@import '@/static/assets/fonts/iconfont.css';

	page {
		background-color: #f2f2f2;
	}

	.course-thumb {
		width: 100%;
		height: 192px;
		float: left;
	}

	.course-thumb>image {
		width: 100%;
		height: 192px;
	}

	.navs {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		background-color: white;
		padding: 20px 15px;
		box-shadow: 0px 2px 4px 0px rgba(204, 204, 204, 0.2);
		display: flex;
	}

	.navs>.item {
		flex: 1;
		text-align: center;
		font-size: 15px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 1;
	}

	.navs>.item.active {
		font-weight: 600;
		color: rgba(23, 132, 237, 1);
	}

	.desc,
	.menus,
	.comments {
		width: 100%;
		height: auto;
		float: left;
		box-sizing: border-box;
		background-color: white;
		padding: 30px 15px 0 15px;
		margin-top: 10px;
	}

	.desc {
		padding-bottom: 30px;
	}

	.menus .video-item {
		width: 100%;
		height: auto;
		float: left;
		display: flex;
		margin-bottom: 30px;
	}

	.menus .video-item>.name {
		flex: 1;
		font-size: 14px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.menus .video-item>.name>.free {
		padding: 1px 3px;
		background-color: rgba(23, 132, 237, 1);
		color: white;
		margin-right: 5px;
		border-radius: 3px;
		font-size: 10px;
	}

	.menus .video-item>.duration {
		margin-left: 10px;
		font-size: 12px;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
	}

	.menus>.chapter-item {
		width: 100%;
		height: auto;
		float: left;
	}

	.menus>.chapter-item>.chapter-name {
		width: 100%;
		height: auto;
		float: left;
		font-size: 14px;
		font-weight: 800;
		color: rgba(51, 51, 51, 1);
		line-height: 1;
		margin-bottom: 30px;
	}

	.comments>.comment-item {
		width: 100%;
		height: auto;
		float: left;
		margin-bottom: 30px;
	}

	.comments>.comment-item>.user {
		width: 100%;
		height: auto;
		float: left;
		margin-bottom: 15px;
		display: flex;
	}

	.comments>.comment-item>.user>.avatar {
		width: 30px;
		height: 30px;
		margin-right: 10px;
	}

	.comments>.comment-item>.user>.avatar>image {
		width: 30px;
		height: 30px;
		border-radius: 50%;
	}

	.comments>.comment-item>.user>.nickname {
		flex: 1;
	}

	.comments>.comment-item>.user>.nickname>.value {
		width: 100%;
		height: auto;
		float: left;
		margin-bottom: 4px;
		font-size: 12px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 1;
		padding-top: 2px;
	}

	.comments>.comment-item>.user>.nickname>.date {
		width: 100%;
		height: auto;
		float: left;
		font-size: 10px;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 1;
	}

	.comments>.comment-item>.content {
		width: 100%;
		height: auto;
		float: left;
		font-size: 14px;
		font-weight: 400;
		color: rgba(51, 51, 51, 1);
		line-height: 22px;
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 50px;
		z-index: 99;
		display: flex;
		box-sizing: border-box;
		padding: 5px 15px 4px 15px;
		background-color: white;
		border-top: 1px solid #f2f2f2;
	}

	.bottom-bar>.colletion {
		margin-right: 15px;
		font-size: 16px;
		line-height: 40px;
		color: rgba(0, 0, 0, .4);
	}

	.bottom-bar>.colletion.active {
		color: rgba(23, 132, 237, 1);
	}

	.bottom-bar>.buttons {
		flex: 1;
		display: flex;
	}

	.bottom-bar>.buttons>.ios-alert {
		width: 100%;
		height: auto;
		float: left;
		font-size: 12px;
		color: #aaa;
		line-height: 40px;
		text-align: center;
	}

	.bottom-bar>.buttons>.start-learn-button {
		flex: 1;
		height: 40px;
		background: linear-gradient(180deg, rgba(51, 186, 247, 1) 0%, rgba(23, 132, 237, 1) 100%);
		color: white;
		border-radius: 4px;
		font-size: 15px;
		font-weight: 500;
		line-height: 40px;
		text-align: center;
	}

	.bottom-bar>.buttons>.buy-button {
		flex: 1;
		height: 40px;
		background: linear-gradient(180deg, rgba(51, 186, 247, 1) 0%, rgba(23, 132, 237, 1) 100%);
		color: white;
		border-radius: 4px 0px 0px 4px;
		font-size: 15px;
		font-weight: 500;
		line-height: 40px;
		text-align: center;
	}

	.bottom-bar>.buttons>.buy-role-button {
		flex: 1;
		height: 40px;
		font-size: 15px;
		font-weight: 500;
		line-height: 40px;
		background: linear-gradient(180deg, rgba(255, 246, 207, 1) 0%, rgba(255, 222, 108, 1) 100%);
		border-radius: 0 4px 4px 0px;
		color: rgba(206, 162, 0, 1);
		text-align: center;
	}

	.hr {
		width: 100%;
		height: 60px;
		float: left;
	}

	.comment-bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 50px;
		box-sizing: border-box;
		padding: 10px 15px 9px 15px;
		display: flex;
		background-color: white;
		border-top: 1px solid #f2f2f2;
	}

	.comment-bottom-bar>.input {
		flex: 1;
	}

	.comment-bottom-bar>.input>input {
		width: 100%;
		height: 30px;
		float: left;
		background: rgba(238, 238, 238, 1);
		border-radius: 18px;
		border: 0;
		box-sizing: border-box;
		padding: 3px 15px;
		font-size: 12px;
	}

	.comment-bottom-bar>.send-button {
		margin-left: 15px;
		font-size: 13px;
		font-weight: 400;
		color: rgba(204, 204, 204, 1);
		line-height: 30px;
	}

	.comment-bottom-bar>.send-button.active {
		color: rgba(23, 132, 237, 1);
	}
</style>
