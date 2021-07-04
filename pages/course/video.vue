<template>
	<view>
		<view class="play-box">
			<block v-if="isBuy">
				<video :src="playUrl" :poster="poster" :title="video.title"
					:poster-for-crawler="course.thumb" @ended="playEnd" @timeupdate="playTimeUpdate"></video>
			</block>
			<block v-else>
				<view class="no-auth">
					<text class="btn">请先订阅</text>
				</view>
			</block>
		</view>

		<view class="navs">
			<view :class="['item', navTab === 'menu' ? 'active' : '']" @click="switchNavTab('menu')" >课程目录</view>
			<view :class="['item', navTab === 'desc' ? 'active' : '']" @click="switchNavTab('desc')" >视频介绍</view>
			<view :class="['item', navTab === 'comment' ? 'active' : '']" @click="switchNavTab('comment')" >讨论区
			</view>
		</view>

		<view class="desc" :hidden="navTab!=='desc'">
			<rich-text :nodes="video.render_desc"></rich-text>
		</view>

		<view class="menus" :hidden="navTab!=='menu'">
			<block v-if="chapters.length === 0">
				<view :class="['video-item', videoId == item.id ? 'active' : '']" v-for="(item,index) in videos[0]" :key="item.id"
					 @click="goVideo(item.id)">
					<view class="name">
						<text class="free" v-if="item.charge===0">试看</text>
						{{item.title}}
					</view>
					<view class="duration">{{utils.durationForHuman(item.duration)}}</view>
				</view>
			</block>

			<block wx:else>
				<view class="chapter-item" v-for="(chapter,index) in chapters" :key="chapter.id" >
					<view class="chapter-name">{{chapter.title}}</view>
					<view class="['video-item',videoId == item.id ? 'active' : '']" v-for="(item,index) in videos[chapter.id]"
						:key="item.id" @click="goVideo(item.id)" >
						<view class="name">
							<text class="free" v-if="item.charge===0">试看</text>
							{{item.title}}
						</view>
						<view class="duration">{{utils.durationForHuman(item.duration)}}</view>
					</view>
				</view>
			</block>
		</view>

		<view class="comments" :hidden="navTab!=='comment'">
			<block v-if="comments.length > 0">
				<view class="comment-item" v-for="(comment,index) in comments" :key="comment.id" >
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

		<view class="bottom-bar" :hidden="navTab === 'comment'" v-if="isBuy === false">
			<view class="buttons">
				<block v-if="isIos">
					<view class="ios-alert">因苹果政策原因无法购买课程</view>
				</block>
				<block v-else>
					<block v-if="video.charge === 0">
						<text class="buy-button" @click.stop="buyCourse">购买课程 ￥{{course.charge}}</text>
					</block>
					<block v-else>
						<text class="buy-button" @click="buyCourse">购买课程 ￥{{course.charge}}</text>
						<text class="buy-video-button" @click="buyVideo">购买此视频 ￥{{video.charge}}</text>
					</block>
				</block>
			</view>
		</view>

		<view class="comment-bottom-bar" :hidden="navTab !== 'comment'">
			<view class="input">
				<input type="text" placeholder="说点什么吧" v-model="commentContent" />
			</view>
			<view :class="['send-button',commentContent.length > 0 ? 'active' : '']" @click.stop="createComment">发布</view>
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
		video
	} from '@/api/index'

	import util from '@/utils/util'

	const app = getApp();
	export default {
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {

			this.videoId = options.id
			this.poster = app.globalData.player_cover

		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			if (!uni.getStorageSync('access_token')) {
				uni.navigateTo({
					url: '/pages/auth/auth',
				})
			} else {
				this.getVideo();
				this.getComments();
			}
		},
		data() {
			return {
				video: null,
				course: null,
				chapters: [],
				videos: [],
				attachs: [],
				navTab: 'menu',
				isBuy: false,
				videoWatchedProgress: [],
				comments: [],
				commentUsers: [],
				videoId: 0,
				commentContent: '',
				playInfo: [],
				playUrl: '',
				poster: '',
				lastPlaySeconds: 0,
				isIos: util.isIos()
			}
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			return {
				title: this.video.title,
				path: `/pages/course/video?id=${this.videoId}`,
				imageUrl: this.course.thumb
			}
		},
		methods: {
			getVideo() {
				video.info(this.videoId).then(res => {
					uni.setNavigationBarTitle({
						title: res.video.title,
					})

					// 富文本图片溢出
					res.video.render_desc = res.video.render_desc.replace(/\<img/gi,
						'<img style="max-width:100%;height:auto" ');
					this.video = res.video;
					this.course = res.course;
					this.chapters = res.chapters;
					this.videos = res.videos;
					this.isBuy = res.is_watch;
					this.videoWatchedProgress = res.videoWatchedProgress;
					// 如果可以看，则获取视频地址
					if (res.is_watch) {
						this.getPlayInfo();
					}
				})
			},

			getPlayInfo() {
				video.playUrl(this.video.id).then(res => {
					if (res.urls.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '播放地址为空',
						})
					} else {
						// console.log(res.urls[0].url);
						this.playInfo = res.urls;
						this.playUrl = res.urls[0].url;

					}
				})
			},

			getComments() {
				video.comments(this.videoId).then(res => {
					this.commentUsers = res.users;
					this.comments = res.comments;
				})
			},

			switchNavTab(tab) {
				if (this.navTab === tab) {
					return;
				}
				this.navTab = tab;

			},

			// inputCommentContent(e) {
			// 	this.commentContent = e.detail.value
			// },

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

				video.createComment(this.videoId, {
					content: this.commentContent
				}).then(() => {
					this.commentContent = '';
					this.getComments();
					uni.showToast({
						icon: 'none',
						title: '成功，审核通过将会展示',
					});
				}).catch(e => {
					uni.showToast({
						icon: 'none',
						title: e,
					})
				})
			},

			goVideo(videoId) {
				uni.redirectTo({
					url: '/pages/course/video?id=' + videoId,
				})
			},
			playEnd(e) {
				// 播放统计
				video.record(this.videoId, {
					duration: this.video.duration
				}).then(res => {
					console.log('播放完成', res);
				})
			},
			playTimeUpdate(e) {
				let seconds = parseInt(e.detail.currentTime);
				if (seconds - this.lastPlaySeconds > 10) {
					this.lastPlaySeconds =  seconds;
					// 播放统计
					video.record(this.videoId, {
						duration: seconds
					}).then(res => {
						console.log('播放进度变更', res);
					})
				}
			},

			buyCourse() {
				util.go(`/pages/order/index?id=${this.course.id}&total=${this.course.charge}&name=${this.course.title}&type=course`,
					true);
			},

			buyVideo() {
				util.go(`/pages/order/index?id=${this.video.id}&total=${this.video.charge}&name=${this.video.title}&type=video`,
					true);
			}
		}
	}
</script>

<style>


page {
  background-color: #f2f2f2;
}

.play-box {
  width: 100%;
  height: 192px;
  float: left;
  background-color: rgba(0, 0, 0, 1);
}

.play-box>video {
  width: 100%;
  height: 192px;
  float: left;
}

.play-box>.no-auth {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding-left: 30px;
  padding-right: 30px;
}

.play-box>.no-auth>.btn {
  display: inline-block;
  width: 100%;
  height: 42px;
  line-height: 42px;
  text-align: center;
  background-color: rgba(0, 0, 0, .9);
  color: rgba(23, 132, 237, 1);
  border: 1px solid rgba(23, 132, 237, 1);
  border-radius: 21px;
  margin-top: 70px;
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

.menus .video-item.active>.name {
  color: rgba(23, 132, 237, 1);
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

.bottom-bar>.buttons>.buy-button {
  flex: 1;
  height: 40px;
  background: linear-gradient(180deg, rgba(51, 186, 247, 1) 0%, rgba(23, 132, 237, 1) 100%);
  color: white;
  font-size: 15px;
  font-weight: 500;
  line-height: 40px;
  text-align: center;
}

.bottom-bar>.buttons>.buy-video-button {
  flex: 1;
  height: 40px;
  background: linear-gradient(180deg, rgba(255, 246, 207, 1) 0%, rgba(255, 222, 108, 1) 100%);
  color: rgba(206, 162, 0, 1);
  font-size: 15px;
  font-weight: 500;
  line-height: 40px;
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
