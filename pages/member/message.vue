<template>
	<view>
		<view class="messages-list-box">
			<block v-if="messages.length > 0">
				<view class="item" v-for="(message,index) in messages" :key="message.id" @click="markRead($event)"
					:data-index="index" :data-read="message.read_at" :data-id="message.id">
					<view class="icon">
						<image src="../../images/icons/message/default.png" />
					</view>
					<view class="content">
						<view class="date">
							<text class="value">{{message.created_at}}</text>
							<text class="dot" v-if="message.read_at === null"></text>
						</view>
						<view class="text">
							{{message.data.message}}
						</view>
					</view>
				</view>
			</block>
			<meedu-none v-else></meedu-none>
		</view>
	</view>
</template>
<script>
	import EduNone from "@/components/edu-none.vue"
	import {
		user
	} from '@/api/index'

	export default {
		components: {
			"meedu-none": EduNone
		},
		data() {
			return {
				pagination: {
					page: 1,
					page_size: 8,
					is_over: false
				},
				messages: []
			};
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getData(true);
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.getData(true);
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.loadMore();
		},
		methods: {
			getData(reset = false) {
				if (reset) {
					this.pagination.page = 1;
					this.pagination.is_over = false;
					this.messages = []

				}
				if (this.pagination.is_over) {
					return;
				}
				user.messages(this.pagination).then(res => {
					let data = res.data;
					if (data.length === 0) {
						this.pagination.is_over =  true;
						
					} else {
						let list = this.messages;
						list.push(...data);
						this.messages =  list;
					}

					if (reset) {
						uni.stopPullDownRefresh();
					}
				})
			},

			loadMore() {
				if (this.pagination.is_over) {
					return;
				}
				
				this.pagination.page =  this.data.pagination.page + 1;
				
				this.getData();
			},

			markRead(e) {
				if (e.currentTarget.dataset.read !== null) {
					return;
				}
				user.messageMarkRead(e.currentTarget.dataset.id).then(res => {
					let key = `messages[${e.currentTarget.dataset.index}].read_at`;
					this[key] = 1;
				});
			}
		}
	}
</script>

<style lang="scss">
	.messages-list-box {
		width: 100%;
		height: auto;
		float: left;
		background-color: white;
	}

	.messages-list-box>.item {
		width: 100%;
		height: auto;
		float: left;
		display: flex;
		box-sizing: border-box;
		padding: 15px;
		border-bottom: 1px solid #f2f2f2;
	}

	.messages-list-box>.item>.icon {
		width: 48px;
		height: 48px;
		margin-right: 10px;
	}

	.messages-list-box>.item>.icon>image {
		width: 48px;
		height: 48px;
	}

	.messages-list-box>.item>.content {
		flex: 1;
	}

	.messages-list-box>.item>.content>.date {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 6px;
		font-size: 12px;
		font-weight: 400;
		color: rgba(204, 204, 204, 1);
		line-height: 1;
		margin-bottom: 10px;
	}

	.messages-list-box>.item>.content>.date>.dot {
		margin-left: 8px;
		display: inline-block;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background-color: red;
	}

	.messages-list-box>.item>.content>.text {
		width: 100%;
		height: auto;
		float: left;
		font-size: 13px;
		font-weight: 400;
		color: rgba(153, 153, 153, 1);
		line-height: 1;
	}
</style>
