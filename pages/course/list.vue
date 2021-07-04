<template>
	<view>
		<view class="course-category-container">
			<view :class="['category-item','first',pagination.category_id === 0 ? 'active' : '']"
				@click.stop="swtichCategory" data-cid="0">全部</view>
			<view :class="['category-item', pagination.category_id === category.id ? 'active' : '']"
				v-for="(category,index) in categories" :key="category.id" @click="swtichCategory(category.id)">
				{{category.name}}
			</view>
		</view>

		<view class="course-list">
			<block v-if="courses.length > 0">
				<meedu-course :name="course.title" :thumb="course.thumb" :charge="course.charge" :course_id="course.id"
					:user-count="course.user_count" :category="course.category.name" v-for="(course,index) in courses"
					:key="course.id"></meedu-course>
			</block>
			<meedu-none v-else></meedu-none>
		</view>
	</view>
</template>

<script>
	import {
		course
	} from '@/api/index'
	import EduCourse from "@/components/edu-course.vue"
	import EduNone from "@/components/edu-none.vue"
	export default {
		components: {
			"meedu-course": EduCourse,
			"meedu-none": EduNone
		},
		onLoad: function(options) {
			this.getCourse()
			course.categories().then(res => {
				this.categories = res;
			})
		},
		data() {
			return {
				categories: [],
				courses: [],
				pagination: {
					page: 1,
					page_size: 8,
					category_id: 0
				},
				isOver: false
			};
		},
		  /**
		   * 页面上拉触底事件的处理函数
		   */
		  onReachBottom: function () {
		    this.loadMore();
		  },

		methods: {
			swtichCategory(cid) {
				this.pagination.category_id = cid
				this.getCourse(true);
			},
			loadMore() {
				if (this.isOver) {
					return;
				}		
				this.pagination.page = this.pagination.page + 1;
				this.getCourse();
			},
			getCourse(reset = false) {
				if (reset) {
					this.pagination.page = 1;
					this.isOver = false;
					this.courses = [];

				}
				if (this.isOver) {
					return;
				}
				course.list(this.pagination).then(res => {
					let data = res.data;
					if (data.length === 0) {
						this.isOver = true;
						return;
					}
					let courses = this.courses;
					courses.push(...data);
					this.courses = courses;
				})
			}
		}
	}
</script>

<style lang="scss">
	.course-category-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 11;
		width: 100%;
		height: 40px;
		padding-top: 5px;
		padding-bottom: 5px;
		float: left;
		white-space: nowrap;
		overflow-y: auto;
		background-color: white;
		box-shadow: 0 2px 2px 0 #f2f2f2;
	}

	.category-item {
		display: inline-block;
		font-size: 14px;
		padding: 2px 15px;
		margin-right: 10px;
	}

	.category-item.first {
		margin-left: 10px;
	}

	.category-item.active {
		background-color: #0b76de;
		border-radius: 15px;
		color: white;
	}

	.course-list {
		width: 100%;
		height: auto;
		float: left;
		margin-top: 40px;
		box-sizing: border-box;
		padding-left: 15px;
		padding-right: 15px;
		padding-bottom: 50px;
	}
</style>
