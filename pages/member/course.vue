<template>
	<view>
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
	import EduCourse from "@/components/edu-course.vue"
	import EduNone from "@/components/edu-none.vue"
	import {
		user
	} from '@/api/index'

	export default {
		components: {
			"meedu-course": EduCourse,
			"meedu-none": EduNone
		},
		data() {
			return {
				pagination: {
					page: 1,
					page_size: 8,
					is_over: false
				},
				courses: []
			};
		},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.getCourses(true);
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.getCourses(true);
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {
			this.loadMore();
		},
		methods: {
			getCourses(reset = false) {
				if (reset) {
					this.pagination.page == 1;
					this.pagination.is_over = false;
					this.courses = []

				}
				if (this.pagination.is_over) {
					return;
				}
				user.courses(this.pagination).then(res => {
					let data = res.data;
					if (data.length === 0) {
					    this.pagination.is_over= true;
						
					} else {
						let list = this.courses;
						list.push(...data);
						this.courses = list;
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
				this.pagination.page = this.pagination.page + 1;
				this.getCourses();
			}
		}
	}
</script>

<style lang="scss">


.course-list {
  width: 100%;
  height: auto;
  float: left;
  box-sizing: border-box;
  padding-left: 15px;
  padding-right: 15px;
  padding-bottom: 50px;
  background-color: white;
}
</style>
