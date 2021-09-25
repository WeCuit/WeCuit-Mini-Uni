<template>
 	<view>
 		<!-- pages/attendance/edit.wxml -->
 		<!-- <mp-cells ext-class="my-cells" title="自动打卡操作">
  <view class="check-info">
  <picker mode="time" value="{{autoCheckIn.time}}" start="06:00" end="23:59" bindchange="bindAutoCheckInTime">
    {{autoCheckIn.time}}
  </picker>
  <label>
    <switch checked="{{isAutoCheckIn}}" bindchange="autoCheckInSwitch" disabled="{{!isSubscription}}" />
    自动打卡
  </label>
  <label style="margin-top:10rpx;display: block;" bindtap="bindShowIntro">
    <view wx:if="{{!showIntro}}">查看说明</view>
    <text wx:else style="color:gray;">
      第一次添加后，1分钟之内系统会执行一次打卡操作，没有订阅将无法收到提醒;
    打卡数据为下方填写内容;
    提醒次数取决于订阅次数
    </text>
  </label>
  <label style="display: flex;">
    <button style="width:151px;font-size: small;{{!isSubscription?'color:red;':''}}" type="primary" disabled="{{!isSubscription}}" bindtap="updateAutoCheckIn">
      {{isSubscription?'更新自动打卡':'请先订阅服务'}}
    </button>
    <navigator url="/pages/my/sub/sub">
      <button style="width:126px;font-size: small;" type="primary">订阅管理</button>
    </navigator>
  </label>
  </view>
</mp-cells> -->
 		<mp-cells ext-class="my-cells" title="打卡时间">
 			<mp-cell ext-class="my-cell">
 				<view>{{checkInTime}}</view>
 			</mp-cell>
 		</mp-cells>

 		<!-- 表单开始 -->
 		<d-form :formData="formData" :showSubmitBtn="true" @DynamicFormSubmit="onFormSubmit"></d-form>

 		<!-- 回首页按钮悬浮按钮 -->
 		<view v-if="fromShare">
 			<navigator url="/pages/index/index" open-type="reLaunch" class="floatBtn"
 				style="bottom: 5%;font-size: x-large;">
 				<view class="iconfont icon-shouye"></view>
 			</navigator>
 		</view>
 	</view>
 </template>

 <script>
 	// pages/attendance/edit.js
 	const app = getApp();
 	import {
 		genQuerySign
 	} from '../../utils/tool';
 	import {
 		getCheckInData,
 		postCheckInData
 	} from './api';
 	import mpCell from "../../miniprogram_npm/weui-miniprogram/cell/cell";
 	import mpCells from "../../miniprogram_npm/weui-miniprogram/cells/cells";
 	import dForm from "../../wxcomponents/dynamicForm/index";

 	export default {
 		data() {
 			return {
 				link: '',
 				checkInTime: '',
 				requestRet: '',
 				formData: {},
 				autoCheckIn: {
 					time: new Date().getHours() + ':' + new Date().getMinutes()
 				},
 				isAutoCheckIn: false,
 				isSubscription: false,
 				showIntro: false,
 				sessionInfo: {},
 				tempForm: null,
 				fromShare: false
 			};
 		},

 		components: {
 			mpCell,
 			mpCells,
 			dForm
 		},
 		props: {},

 		/**
 		 * 生命周期函数--监听页面加载
 		 */
 		onLoad: function(options) {
 			this.link = decodeURIComponent(options.link);
 		},

 		/**
 		 * 生命周期函数--监听页面初次渲染完成
 		 */
 		onReady: function() {
			// #ifdef MP-QQ
			if (1 === getCurrentPages().length) {
					this.fromShare = true
			}
			// #endif
 		},

 		/**
 		 * 生命周期函数--监听页面显示
 		 */
 		onShow: function() {
 			this.sessionInfo = app.globalData.sessionInfo;
 			app.globalData.autoLoginProcess.then(() => {
 				this.loadCheckInData();
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
 			this.loadCheckInData()
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
 			loadCheckInData() {
 				this.getEditDetail().then(res => {
 					const {
 						data
 					} = res.data;
 					uni.stopPullDownRefresh();
 					uni.hideLoading();
 					this.setData({
 						formData: data.form.data,
 						checkInTime: data.form.checkTime
 					});
 					uni.setNavigationBarTitle({
 						title: data.form.title
 					});
 				}).catch(err => {
 					if (err && 20401 == err.errorCode) {
 						// 计算中心未登录
 						if (app.globalData.isUser) app.globalData.loginClass.ccDoLogin().then(this
 							.loadCheckInData);
 						else {
 							uni.navigateTo({
 								url: '../my/sso/sso'
 							});
 						}
 					}

 				});

 			},
 			onFormSubmit: function(e) {
				
 				var data = e.detail;
 				var form = {};

 				for (var key in data) {
 					let type = data[key].original.type;

 					switch (type) {
 						case 'picker':
 							let idx = data[key].idx;
 							form[key] = data[key].original.range[idx].id;
 							break;

 						case 'input':
 						case 'textarea':
 							form[key] = data[key].value;
 							break;
 					}
 				}

 				this.tempForm = form;
 				postCheckInData(this.link, this.sessionInfo.JSZX_cookie, form).then(res => {
 					const resp = res.data;
 					const {
 						data
 					} = resp;
 					uni.showToast({
 						icon: 'none',
 						title: data.msg
 					});
					this.formData = data.form.data
					this.checkInTime = data.form.checkTime
 				}).catch(err => {
 					console.log(err);
 					const msg = err && err.data && err.data.msg ? err.data.msg : '未知异常';
 					uni.showToast({
 						icon: 'none',
 						title: msg
 					});
 				});
 			},
 			// 获取打卡详细信息
 			getEditDetail: function() {
 				uni.showLoading({
 					title: '获取打卡信息'
 				});
 				return getCheckInData(this.sessionInfo.JSZX_cookie, this.link);
 			},
 			getCheckInInfo: function() {
 				app.globalData.httpPost({
 					url: '/Task/checkInStatusV2',
 					data: {
 						openid: app.globalData.openid,
 						sign: genQuerySign('/Task/checkInStatusV2/', app.globalData.openid)
 					}
 				}).then(data => {
 					uni.stopPullDownRefresh();
 					this.setData({
 						isSubscription: data.isSubscription
 					});

 					if (false !== data.autoCheckIn) {
 						this.setData({
 							autoCheckIn: data.autoCheckIn,
 							isAutoCheckIn: true
 						});
 					}
 				}).catch(err => {
 					uni.stopPullDownRefresh();
 					if (err.errMsg) uni.showToast({
 						icon: 'none',
 						title: err.errMsg
 					});
 				});
 			},
 			// 监测自动打卡开关
 			autoCheckInSwitch: function(e) {
 				this.isAutoCheckIn = e.detail.value;
 			},
 			bindShowIntro: function() {
 				this.setData({
 					showIntro: !this.showIntro
 				});
 			},
 			// 更新自动打卡状态
 			updateAutoCheckIn: function() {
 				if (this.tempForm == null) {
 					uni.showToast({
 						icon: 'none',
 						title: '请至少提交一次！'
 					});
 					return;
 				}

 				new Promise((resolve, reject) => {
 					if (this.isAutoCheckIn) {
 						this.setData({
 							isAutoCheckIn: true
 						});
 						resolve(false);
 					} else {
 						this.setData({
 							isAutoCheckIn: false
 						}); // 删除

 						resolve(true);
 					}
 				}).then(del => {
 					//发起网络请求
 					if (!del) {
 						// 添加
 						this.addCheckInTask(this.autoCheckIn.time, app.globalData.openid, 0);
 					} else {
 						// 删除
 						this.addCheckInTask('06:00', app.globalData.openid, 1);
 						let a = this.autoCheckIn;
 						this.setData({
 							autoCheckIn: a
 						});
 					}
 				}).catch(err => {
 					console.log(err);
 					uni.showToast({
 						icon: 'none',
 						title: err.errMsg
 					});
 				});
 			},
 			bindAutoCheckInTime: function(e) {
 				let a = this.autoCheckIn;
 				a.time = e.detail.value;
 				this.setData({
 					autoCheckIn: a
 				});
 			},
 			addCheckInTask: function(time, openid, action) {
 				uni.showLoading({
 					title: '修改中~'
 				});
 				var data = {
 					time: time,
 					openid: openid,
 					action: action,
 					form: this.tempForm,
 					link: this.link
 				};
 				let encrypted = app.globalData.RSAEncrypt(JSON.stringify(data));
 				app.globalData.httpPost({
 					url: '/Task/checkInInfoV2/',
 					data: {
 						data: encrypted
 					}
 				}).then(data => {
 					uni.hideLoading();
 					uni.showToast({
 						icon: 'none',
 						title: data.errMsg
 					});
 				}).catch(err => {
 					uni.hideLoading();
 					if (err.errMsg) uni.showToast({
 						icon: 'none',
 						title: err.errMsg
 					});
 				});
 			}
 		}
 	};
 </script>
 <style>
 	/* pages/attendance/edit.wxss */
 	@import "../common.css";

 	@media (prefers-color-scheme: dark) {

 		/* DarkMode 下的样式 start */
 		page,
 		.check-info {
 			background-color: #1b1b1b;
 		}

 		.my-cells>.weui-cells__title,
 		.my-cell>.weui-cell__ft {
 			color: gray
 		}

 		/* DarkMode 下的样式 end */
 	}

 	@import "./edit-wxa-auto-dark.css";
 </style>
