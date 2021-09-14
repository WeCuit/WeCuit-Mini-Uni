<template>
	<view>
		<!--pages/JSZX/jkdk.wxml-->
		<!--WXML示例代码-->
		<mp-cells ext-class="my-cells" title="最新的打卡任务">
			<block v-for="(item, index) in list.today" :key="index">
				<mp-cell ext-class="my-cell" :data-link="item.link" @tap.native.stop="openCheckIn">
					<view>{{item.status}} {{item.title}}</view>
					<!-- <view slot="footer">说明文字</view> -->
				</mp-cell>
			</block>
		</mp-cells>
		<mp-cells ext-class="my-cells" title="已结束的打卡任务">
			<mp-cell v-for="(item, index) in list.outDate" :key="index" ext-class="my-cell" :data-link="item.link"
				@tap="openCheckIn">
				<view>{{item.status}} {{item.title}}</view>
				<!-- <view slot="footer">说明文字</view> -->
			</mp-cell>
		</mp-cells>
	</view>
</template>

<script>
	// pages/JSZX/jkdk.js
	import {
		getCheckInList,
		ccDoLogin
	} from './api';
	const app = getApp();
	import mpCell from "../../miniprogram_npm/weui-miniprogram/cell/cell";
	import mpCells from "../../miniprogram_npm/weui-miniprogram/cells/cells";

	export default {
		data() {
			return {
				list: {
					today: [{
						title: "数据加载中......",
						status: "X"
					}]
				},
				JSZX_cookie: "",
				sessionInfo: {},
				isFirstTry: true
			};
		},

		components: {
			mpCell,
			mpCells
		},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(options) {},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			this.sessionInfo = app.globalData.sessionInfo;

			if (app.globalData.checkInList) {
				this.setData({
					list: app.globalData.checkInList
				});
			} else this.loadCheckInList();
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

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
			this.loadCheckInList()
		},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 分享至微信朋友圈
		 */
		onShareTimeline: function(e) {
			// console.log(e)
			return {
				title: "健康打卡"
			};
		},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			return {
				title: "健康打卡",
				// for wechat
				path: "/pages/attendance/list",
				// for qq
				query: ""
			};
		},
		methods: {
			loadCheckInList() {
				uni.showLoading({
					title: "获取打卡列表~"
				});
				app.globalData.autoLoginProcess.then(() => {
					return this.getCheckInList();
				}).then(res => {
					const {
						data
					} = res.data;
					this.setData({
						list: data.list
					});
					app.globalData.checkInList = data.list;
					uni.hideLoading();
					return Promise.reject(null);
				}).catch(err => {
					if (null === err) return Promise.reject(null);
					const {
						data
					} = err;

					if (20401 == data.code) {
						// 错误码：未登录
						if (app.globalData.isUser && this.isFirstTry) {
							this.isFirstTry = false;
							uni.showLoading({
								title: '尝试登录~'
							});
							ccDoLogin(app.globalData.accountInfo.userId, app.globalData.accountInfo.userPass)
								.then(res => {
									const resp = res.data
									const {
										data
									} = resp;
									app.globalData.sessionInfo.JSZX_cookie = data.cookie;
									uni.setStorage({
										key: "JSZX_cookie",
										data: data.cookie
									});
									this.loadCheckInList();
								});
						} else {
							uni.navigateTo({
								url: "../my/sso/sso"
							});
						}
					} else if (data.msg) {
						uni.showToast({
							icon: "none",
							title: data.msg
						});
					} else {
						console.log(err);
						uni.showToast({
							icon: "none",
							title: "未知异常"
						});
						return Promise.reject(null);
					}
				});
			},
			getCheckInList: function() {
				return getCheckInList(this.sessionInfo.JSZX_cookie);
			},
			openCheckIn: function(e) {
				if (e.currentTarget.dataset.link) uni.navigateTo({
					url: "/pages/checkIn/edit?link=" + encodeURIComponent(e.currentTarget.dataset.link)
				});
			}
		}
	};
</script>
<style>
	/* pages/JSZX/jkdk.wxss */
	@import "../common.css";

	@media (prefers-color-scheme: dark) {

		/* DarkMode 下的样式 start */
		page {
			background-color: #1b1b1b;
		}

		.my-cells>.weui-cells__title {
			color: gray
		}

		/* DarkMode 下的样式 end */
	}
</style>
