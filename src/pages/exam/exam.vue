<template>
	<view>
		<!--pages/exam/exam.wxml-->
		<picker mode="multiSelector" @change="bindMultiPickerChange" @columnchange="bindMultiPickerColumnChange"
			:value="termIndex" :range="termArray" range-key="name">
			<view class="picker">
				学年学期：{{termArray[0][termIndex[0]].name}}，{{termArray[1][termIndex[1]].name}}
			</view>
		</picker>
		<picker @change="bindPickerChange" :value="batchIndex" :range="batchArray" range-key="name">
			<view class="picker">
				考试批次：{{batchArray[batchIndex].name}}
			</view>
		</picker>

		<button @tap="bindExamQuery" type="primary" :disabled="batchArray.length == 0">查询</button>

		<view v-for="(item, index) in examList" :key="index" class="exam-card">
			<view class="exam-title">课程：{{item.courseName}}</view>
			<!-- 细节 -->
			<view class="exam-info">
				<view>考试类别：{{item.examType}}</view>
				<view>考试日期：{{item.examDate}}</view>
				<view>考试时间：{{item.examTime}}</view>
				<view>考试地点：{{item.examSite}}</view>
				<view>课程学分：{{item.credit}}</view>
				<view>考试状态：{{item.examStatus}}</view>
				<view>考试备注：{{item.remark}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	// pages/exam/exam.js
	import {
		getExamOption,
		getExamTable
	} from './api';
	const app = getApp();

	export default {
		data() {
			return {
				examList: [],
				batchArray: [{
					id: "602",
					name: "期末考试"
				}],
				batchIndex: 0,
				termArray: [
					[{
						name: "20??-20??"
					}],
					[{
						id: '402',
						name: "第?学期"
					}]
				],
				termIndex: [0, 0],
				termData: {},
				sessionInfo: {},
				isFirstOpenSSO: true
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {
			this.initData();
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			app.globalData.autoLoginProcess.then(() => {
				this.loadExamOption()
			});
		},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {
			this.loadExamOption()
			.then(uni.stopPullDownRefresh)
			.catch(uni.stopPullDownRefresh)
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {},
		methods: {
			initData: function() {
				this.sessionInfo = app.globalData.sessionInfo;
			},
			bindPickerChange: function(e) {
				// console.log('picker发送选择改变，携带值为', e.detail.value)
				this.setData({
					batchIndex: e.detail.value
				});
			},
			bindMultiPickerChange: function(e) {
				// console.log('MultiPicker发送选择改变，携带值为', e.detail.value)
				this.setData({
					termIndex: e.detail.value
				});
				this.loadExamOption()
			},
			bindMultiPickerColumnChange: function(e) {
				// console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
				var data = {
					termArray: this.termArray,
					termIndex: this.termIndex
				};
				data.termIndex[e.detail.column] = e.detail.value;

				switch (e.detail.column) {
					case 0:
						// 第二列、第三列默认索引值0
						data.termArray[1] = this.termData[e.detail.value];
						data.termIndex[1] = 0;
						break;
				} // console.log(data.termIndex);


				this.setData(data);
			},

			/**
			 * 获取考试选项
			 */
			getExamOption: function() {
				const cookie =
					`semester.id=${this.termArray[1][this.termIndex[1]].id};${this.sessionInfo.JWGL_cookie}; TWFID=${this.sessionInfo.TWFID}`;
				return getExamOption(cookie);
			},

			loadExamOption: function() {
				uni.showLoading({
					title: "获取学期批次~"
				});
				return this.getExamOption().then(res => {
					const resp = res.data;
					const data = resp.data;
					uni.hideLoading();
					var tempData = {};
					var sem = data.semesterCalendar;
					tempData["batchArray"] = data.batch;
					tempData["termArray"] = [sem.semesters[0]];
					this.termData = sem.semesters[1];
					tempData["termArray"][1] = this.termData[sem.yearIndex];
					tempData["termIndex"] = [sem.yearIndex, sem.termIndex];
					this.setData(tempData);
				}).catch(err => {
					uni.hideLoading();
				});
			},

			/**
			 * 考试安排查询请求
			 */
			bindExamQuery: function() {
				const cookie = `${this.sessionInfo.JWGL_cookie}; TWFID=${this.sessionInfo.TWFID}`;
				getExamTable(cookie, this.batchArray[this.batchIndex].id).then(res => {
					const resp = res.data;
					this.setData({
						examList: resp.data.examList
					});
				}).catch(err => {});
			}
		}
	};
</script>
<style>
	/* pages/exam/exam.wxss */
	.exam-card {
		border-radius: 10px;
		background-color: #00c4ff;
		margin: .5rem;
	}

	.exam-title {
		padding: 5px;
		padding-left: 10px;
		border-bottom: 1px solid #a058ff;
	}

	.exam-info {
		display: flex;
		flex-wrap: wrap;
		font-size: small;
		padding-left: 10px;
	}

	.exam-info>view {
		width: 47%;
		padding: 3px;
	}
</style>
